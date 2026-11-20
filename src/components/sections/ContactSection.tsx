"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import {
  submitContactForm,
  type ContactActionState,
} from "@/app/actions/contact";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import {
  FadeInBlock,
  ScrollytellingSection,
  SPRING_SNAPPY,
} from "@/components/motion/ScrollReveal";
import "./ContactSection.css";

const INITIAL_STATE: ContactActionState = {
  status: "idle",
  message: "",
};

type ContactFieldName = "name" | "email" | "message";

export function ContactSection() {
  const { locale, data } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const { contactSection, ui } = data;
  const { contact } = contactSection;
  const contactStrings = ui.contact;

  const formRef = useRef<HTMLFormElement>(null);
  const announcerRef = useRef<HTMLDivElement>(null);
  const syncFieldAriaRef = useRef<
    ((el: HTMLInputElement | HTMLTextAreaElement, announce?: boolean) => void) | null
  >(null);

  const [values, setValues] = useState<Record<ContactFieldName, string>>({
    name: "",
    email: "",
    message: "",
  });
  const [serverErrors, setServerErrors] = useState<
    Partial<Record<ContactFieldName, string>>
  >({});

  const [state, formAction, isPending] = useActionState(
    async (prevState: ContactActionState, formData: FormData) => {
      if (process.env.NODE_ENV !== "production") {
        console.info("[contact-form] Submitting contact form action...");
      }
      const result = await submitContactForm(prevState, formData);
      if (process.env.NODE_ENV !== "production") {
        console.info("[contact-form] Action result:", {
          status: result.status,
          message: result.message,
          fieldErrors: result.fieldErrors,
          debugInfo: result.debugInfo,
        });
      }
      if (result.status === "success") {
        setValues({ name: "", email: "", message: "" });
        setServerErrors({});
        formRef.current?.reset();
      } else {
        setServerErrors(result.fieldErrors ?? {});
      }
      return result;
    },
    INITIAL_STATE,
  );

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const supportsUserInvalid =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("selector(:user-invalid)");

    const dirtyState = new WeakMap<
      HTMLInputElement | HTMLTextAreaElement,
      { hasInteracted: boolean; hasBlurred: boolean }
    >();
    const flagged = new WeakSet<Element>();
    const announced = new WeakSet<Element>();

    let announceTimer: number | undefined;
    let resetTimer: number | undefined;
    let announcedField: Element | undefined;

    const isTrackedControl = (
      target: EventTarget | null,
    ): target is HTMLInputElement | HTMLTextAreaElement =>
      (target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement) &&
      Boolean(target.dataset.error);

    const linkError = (
      el: HTMLInputElement | HTMLTextAreaElement,
      shown: boolean,
    ) => {
      const errorId = el.dataset.error;
      if (!errorId) return;
      const ids = (el.getAttribute("aria-describedby") || "")
        .split(/\s+/)
        .filter((id) => id && id !== errorId);
      if (shown) ids.push(errorId);
      if (ids.length > 0) {
        el.setAttribute("aria-describedby", ids.join(" "));
      } else {
        el.removeAttribute("aria-describedby");
      }
    };

    const spokenText = (node: Element) => {
      const copy = node.cloneNode(true) as Element;
      copy.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
      copy
        .querySelectorAll('[role="img"][aria-label]')
        .forEach((n) =>
          n.replaceWith(`${n.getAttribute("aria-label") || "Error"}: `),
        );
      return (copy.textContent || "").replace(/\s+/g, " ").trim();
    };

    const announceError = (el: HTMLInputElement | HTMLTextAreaElement) => {
      const errorId = el.dataset.error;
      if (!errorId) return;
      const errorEl = document.getElementById(errorId);
      if (!errorEl) return;

      const labelEl = el.labels?.[0];
      const labelPrefix = labelEl ? `${spokenText(labelEl)}: ` : "";

      window.clearTimeout(announceTimer);
      if (announcerRef.current) {
        announcerRef.current.textContent = "";
      }
      announcedField = el;

      // Delay slightly so screen readers finish announcing the next focused element first.
      announceTimer = window.setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = `${labelPrefix}${spokenText(errorEl)}`;
        }
      }, 500);
    };

    const isFieldInvalid = (el: HTMLInputElement | HTMLTextAreaElement) => {
      if (el.getAttribute("data-server-invalid") === "true") {
        return true;
      }
      return supportsUserInvalid
        ? el.matches(":user-invalid")
        : el.classList.contains("user-invalid-fallback");
    };

    const syncAria = (
      el: HTMLInputElement | HTMLTextAreaElement,
      announce = false,
    ) => {
      if (!isTrackedControl(el)) return;
      const invalid = isFieldInvalid(el);

      if (invalid) {
        if (announce && !announced.has(el)) {
          announceError(el);
          announced.add(el);
        }
        el.setAttribute("aria-invalid", "true");
        linkError(el, true);
        flagged.add(el);
      } else if (flagged.has(el) || el.getAttribute("aria-invalid") !== "true") {
        el.setAttribute("aria-invalid", "false");
        linkError(el, false);
        flagged.delete(el);
        announced.delete(el);
        if (announcedField === el) {
          window.clearTimeout(announceTimer);
          if (announcerRef.current) {
            announcerRef.current.textContent = "";
          }
          announcedField = undefined;
        }
      }
    };

    syncFieldAriaRef.current = syncAria;

    form
      .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[data-error]")
      .forEach((control) => syncAria(control));

    const handleBlur = (event: FocusEvent) => {
      const target = event.target;
      if (!isTrackedControl(target)) return;

      if (!supportsUserInvalid) {
        const fieldState = dirtyState.get(target) ?? {
          hasInteracted: false,
          hasBlurred: false,
        };
        fieldState.hasBlurred = true;
        dirtyState.set(target, fieldState);
        if (fieldState.hasInteracted) {
          const isValid = target.validity.valid;
          target.classList.toggle("user-invalid-fallback", !isValid);
          target.classList.toggle("user-valid-fallback", isValid);
        }
      }

      syncAria(target, true);
    };

    const handleInput = (event: Event) => {
      const target = event.target;
      if (!isTrackedControl(target)) return;

      if (!supportsUserInvalid) {
        const fieldState = dirtyState.get(target) ?? {
          hasInteracted: false,
          hasBlurred: false,
        };
        fieldState.hasInteracted = true;
        dirtyState.set(target, fieldState);
        if (fieldState.hasBlurred) {
          const isValid = target.validity.valid;
          target.classList.toggle("user-invalid-fallback", !isValid);
          target.classList.toggle("user-valid-fallback", isValid);
        }
      }

      if (target.hasAttribute("aria-invalid")) {
        syncAria(target);
      }
    };

    const handleInvalid = (event: Event) => {
      const target = event.target;
      if (!isTrackedControl(target)) return;

      if (!supportsUserInvalid) {
        dirtyState.set(target, { hasInteracted: true, hasBlurred: true });
        target.classList.toggle("user-invalid-fallback", !target.validity.valid);
        target.classList.toggle("user-valid-fallback", target.validity.valid);
      }

      announced.add(target);
      syncAria(target);
    };

    const handleReset = () => {
      form
        .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[data-error]")
        .forEach((control) => {
          dirtyState.delete(control);
          control.classList.remove("user-invalid-fallback");
          control.classList.remove("user-valid-fallback");
          flagged.delete(control);
          announced.delete(control);
        });
      window.clearTimeout(announceTimer);
      if (announcerRef.current) {
        announcerRef.current.textContent = "";
      }
      announcedField = undefined;

      resetTimer = window.setTimeout(() => {
        form
          .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
            "[data-error]",
          )
          .forEach((control) => syncAria(control));
      }, 0);
    };

    form.addEventListener("blur", handleBlur, true);
    form.addEventListener("input", handleInput);
    form.addEventListener("invalid", handleInvalid, true);
    form.addEventListener("reset", handleReset, true);

    return () => {
      form.removeEventListener("blur", handleBlur, true);
      form.removeEventListener("input", handleInput);
      form.removeEventListener("invalid", handleInvalid, true);
      form.removeEventListener("reset", handleReset, true);
      window.clearTimeout(announceTimer);
      window.clearTimeout(resetTimer);
      syncFieldAriaRef.current = null;
    };
  }, []);

  useEffect(() => {
    const form = formRef.current;
    const syncAria = syncFieldAriaRef.current;
    if (!form || !syncAria) return;

    const controls =
      form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
        "[data-error]",
      );
    let firstServerInvalid: HTMLInputElement | HTMLTextAreaElement | null =
      null;

    controls.forEach((control) => {
      syncAria(control);
      if (
        !firstServerInvalid &&
        control.getAttribute("data-server-invalid") === "true"
      ) {
        firstServerInvalid = control;
      }
    });

    if (firstServerInvalid) {
      (firstServerInvalid as HTMLInputElement | HTMLTextAreaElement).focus();
    }
  }, [serverErrors]);

  const handleFieldChange = (field: ContactFieldName, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (serverErrors[field]) {
      setServerErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.preventDefault();
      const firstInvalid = form.querySelector<HTMLElement>(
        ":invalid:not([tabindex='-1'])",
      );
      firstInvalid?.focus();
    }
  };

  const showStatus = !isPending && state.status !== "idle";

  return (
    <section
      id="contacto"
      tabIndex={-1}
      aria-labelledby="contacto-heading"
      className="contact-section"
    >
      <ScrollytellingSection offset={["start 95%", "start 55%"]}>
        <div className="portfolio-container">
          <FadeInBlock>
            <SectionHeading
              eyebrow={contactSection.eyebrow}
              title={contactSection.title}
              id="contacto-heading"
            />
          </FadeInBlock>

          <div className="contact-grid">
            <FadeInBlock delay={0.05}>
              <div className="contact-panel contact-info-card">
                <p className="contact-availability">
                  <span
                    className="contact-availability-dot"
                    aria-hidden="true"
                  />
                  <span>{contact.availability}</span>
                </p>

                <h3 className="contact-info-heading">{contact.heading}</h3>
                <p className="contact-info-desc">{contact.description}</p>

                <p className="contact-location">
                  <span className="contact-location-label font-mono-tech">
                    {contactStrings.locationLabel}
                  </span>
                  <span>{contact.location}</span>
                </p>

                <div className="contact-email-box">
                  <div className="contact-email-meta">
                    <span className="contact-email-label font-mono-tech">
                      {contactStrings.directEmailLabel}
                    </span>
                    <code
                      id="contact-email-value"
                      className="contact-email-value font-mono-tech"
                    >
                      {contact.email}
                    </code>
                  </div>
                  <CopyEmailButton targetId="contact-email-value" />
                </div>

                <div className="contact-social-links">
                  <motion.a
                    href={contact.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-link"
                    whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    transition={SPRING_SNAPPY}
                  >
                    <span>GitHub</span>
                    <span aria-hidden="true">↗</span>
                    <span className="visually-hidden">
                      {ui.opensInNewTab}
                    </span>
                  </motion.a>
                  <motion.a
                    href={contact.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-link"
                    whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    transition={SPRING_SNAPPY}
                  >
                    <span>LinkedIn</span>
                    <span aria-hidden="true">↗</span>
                    <span className="visually-hidden">
                      {ui.opensInNewTab}
                    </span>
                  </motion.a>
                </div>
              </div>
            </FadeInBlock>

            <FadeInBlock delay={0.12}>
              <div className="contact-panel contact-form-card">
                <h3 id="contact-form-heading" className="contact-form-heading">
                  {contact.formHeading}
                </h3>

                <form
                  ref={formRef}
                  action={formAction}
                  onSubmit={handleSubmit}
                  aria-labelledby="contact-form-heading"
                  className="contact-form"
                >
                  <input type="hidden" name="locale" value={locale} />

                  <div className="contact-field">
                    <label
                      htmlFor="contact-name"
                      className="contact-field-label"
                    >
                      {contactStrings.nameLabel}{" "}
                      <span className="required-mark" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <span id="contact-name-hint" className="field-hint">
                      {contactStrings.nameHint}
                    </span>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      enterKeyHint="next"
                      required
                      minLength={2}
                      maxLength={100}
                      value={values.name}
                      onChange={(e) =>
                        handleFieldChange("name", e.target.value)
                      }
                      aria-describedby="contact-name-hint"
                      data-error="contact-name-error"
                      data-server-invalid={
                        serverErrors.name ? "true" : undefined
                      }
                      className="contact-field-control"
                    />
                    <div id="contact-name-error" className="field-error">
                      <span role="img" aria-label="Error">
                        ⚠
                      </span>{" "}
                      {serverErrors.name || contactStrings.nameError}
                    </div>
                  </div>

                  <div className="contact-field">
                    <label
                      htmlFor="contact-email"
                      className="contact-field-label"
                    >
                      {contactStrings.emailLabel}{" "}
                      <span className="required-mark" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <span id="contact-email-hint" className="field-hint">
                      {contactStrings.emailHint}
                    </span>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      enterKeyHint="next"
                      required
                      maxLength={160}
                      value={values.email}
                      onChange={(e) =>
                        handleFieldChange("email", e.target.value)
                      }
                      aria-describedby="contact-email-hint"
                      data-error="contact-email-error"
                      data-server-invalid={
                        serverErrors.email ? "true" : undefined
                      }
                      className="contact-field-control"
                    />
                    <div id="contact-email-error" className="field-error">
                      <span role="img" aria-label="Error">
                        ⚠
                      </span>{" "}
                      {serverErrors.email || contactStrings.emailError}
                    </div>
                  </div>

                  <div className="contact-field">
                    <label
                      htmlFor="contact-message"
                      className="contact-field-label"
                    >
                      {contactStrings.messageLabel}{" "}
                      <span className="required-mark" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <span id="contact-message-hint" className="field-hint">
                      {contactStrings.messageHint}
                    </span>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      required
                      minLength={10}
                      maxLength={3000}
                      enterKeyHint="enter"
                      value={values.message}
                      onChange={(e) =>
                        handleFieldChange("message", e.target.value)
                      }
                      aria-describedby="contact-message-hint"
                      data-error="contact-message-error"
                      data-server-invalid={
                        serverErrors.message ? "true" : undefined
                      }
                      className="contact-field-control contact-field-textarea"
                    />
                    <div id="contact-message-error" className="field-error">
                      <span role="img" aria-label="Error">
                        ⚠
                      </span>{" "}
                      {serverErrors.message || contactStrings.messageError}
                    </div>
                  </div>

                  <div className="contact-form-actions">
                    <motion.button
                      type="submit"
                      className="contact-submit-btn"
                      disabled={isPending}
                      whileHover={
                        shouldReduceMotion || isPending
                          ? undefined
                          : { y: -1 }
                      }
                      whileTap={
                        shouldReduceMotion || isPending
                          ? undefined
                          : { scale: 0.98 }
                      }
                      transition={SPRING_SNAPPY}
                    >
                      {isPending
                        ? contactStrings.submitPending
                        : contactStrings.submitIdle}
                    </motion.button>
                  </div>

                  <motion.div
                    role="status"
                    aria-live="polite"
                    className="contact-form-status"
                    data-status={showStatus ? state.status : undefined}
                    animate={
                      showStatus
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 0 }
                    }
                    transition={{ duration: 0.2 }}
                  >
                    {showStatus ? (
                      <>
                        <span aria-hidden="true">
                          {state.status === "success" ? "✓" : "⚠"}
                        </span>
                        <span>{state.message}</span>
                      </>
                    ) : null}
                  </motion.div>

                  <div className="visually-hidden" aria-hidden="true">
                    <label htmlFor="contact-hp-field">
                      {contactStrings.honeypotLabel}
                    </label>
                    <input
                      id="contact-hp-field"
                      name="hp_field_check"
                      type="text"
                      tabIndex={-1}
                      autoComplete="nope"
                      defaultValue=""
                      data-lpignore="true"
                      data-1p-ignore="true"
                      data-form-type="other"
                    />
                  </div>
                </form>
              </div>
            </FadeInBlock>
          </div>
        </div>
      </ScrollytellingSection>

      <div
        ref={announcerRef}
        aria-live="polite"
        className="visually-hidden"
      />
    </section>
  );
}
