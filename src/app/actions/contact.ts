"use server";

export type ContactDebugInfo = {
  requestId: string;
  stage: string;
  detail?: string;
  resendStatus?: number;
  emailId?: string;
};

export type ContactActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
  debugInfo?: ContactDebugInfo;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const IS_DEV = process.env.NODE_ENV !== "production";

function buildDebugInfo(
  debugInfo: ContactDebugInfo,
): ContactDebugInfo | undefined {
  return IS_DEV ? debugInfo : undefined;
}

export async function submitContactForm(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const requestId = crypto.randomUUID().slice(0, 8);
  const startedAt = Date.now();
  const tag = `[contact-action][${requestId}]`;

  const rawLocale = String(formData.get("locale") || "es").trim();
  const isEn = rawLocale === "en";

  const honeypotValue = String(formData.get("hp_field_check") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  console.info(tag, "Received submission", {
    timestamp: new Date().toISOString(),
    locale: isEn ? "en" : "es",
    nameLen: name.length,
    emailPresent: email.length > 0,
    messageLen: message.length,
    honeypotLen: honeypotValue.length,
  });

  // Honeypot field: bots fill hidden inputs, humans leave it blank.
  if (honeypotValue.length > 0) {
    console.warn(tag, "Short-circuited by honeypot field `hp_field_check`", {
      honeypotLen: honeypotValue.length,
    });
    return {
      status: "success",
      message: isEn ? "Message received." : "Mensaje recibido.",
      debugInfo: buildDebugInfo({
        requestId,
        stage: "honeypot-blocked",
        detail: `Hidden field "hp_field_check" had length ${honeypotValue.length}`,
      }),
    };
  }

  const fieldErrors: Partial<Record<"name" | "email" | "message", string>> = {};

  if (name.length < 2) {
    fieldErrors.name = isEn
      ? "Please enter your name (at least 2 characters)."
      : "Ingresa tu nombre (al menos 2 caracteres).";
  } else if (name.length > 100) {
    fieldErrors.name = isEn
      ? "Name must not exceed 100 characters."
      : "El nombre no debe exceder 100 caracteres.";
  }

  if (!email) {
    fieldErrors.email = isEn
      ? "Please enter your email address."
      : "Ingresa tu correo electrónico.";
  } else if (email.length > 160) {
    fieldErrors.email = isEn
      ? "Email address must not exceed 160 characters."
      : "El correo electrónico no debe exceder 160 caracteres.";
  } else if (!EMAIL_PATTERN.test(email) || /[\r\n]/.test(email)) {
    fieldErrors.email = isEn
      ? "Please enter a valid email address (e.g. you@domain.com)."
      : "Ingresa un correo electrónico válido (ejemplo: tu@dominio.com).";
  }

  if (message.length < 10) {
    fieldErrors.message = isEn
      ? "Tell me about your project or inquiry (at least 10 characters)."
      : "Cuéntame sobre tu proyecto o consulta (al menos 10 caracteres).";
  } else if (message.length > 3000) {
    fieldErrors.message = isEn
      ? "Message must not exceed 3000 characters."
      : "El mensaje no debe exceder 3000 caracteres.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    console.warn(tag, "Server validation failed", {
      invalidFields: Object.keys(fieldErrors),
    });
    return {
      status: "error",
      message: isEn
        ? "Please review the highlighted fields before submitting."
        : "Revisa los campos marcados antes de enviar.",
      fieldErrors,
      debugInfo: buildDebugInfo({
        requestId,
        stage: "validation-failed",
        detail: `Invalid fields: ${Object.keys(fieldErrors).join(", ")}`,
      }),
    };
  }

  const resendApiKey = process.env.RESEND_API_KEY?.trim() || "";
  const contactToEmail = process.env.CONTACT_TO_EMAIL?.trim() || "";
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    "Portafolio <onboarding@resend.dev>";

  const keySummary = resendApiKey
    ? `${resendApiKey.slice(0, 3)}... (len=${resendApiKey.length})`
    : "missing";

  console.info(tag, "Environment configuration check", {
    hasResendApiKey: Boolean(resendApiKey),
    resendKeyPreview: keySummary,
    hasContactToEmail: Boolean(contactToEmail),
    contactToEmail: contactToEmail || "missing",
    fromEmail,
  });

  if (!resendApiKey || !contactToEmail) {
    const missing: string[] = [];
    if (!resendApiKey) missing.push("RESEND_API_KEY");
    if (!contactToEmail) missing.push("CONTACT_TO_EMAIL");

    console.warn(tag, "Missing required env vars; returning demo fallback", {
      missing,
    });
    return {
      status: "success",
      message: isEn
        ? "Message validated successfully. Configure RESEND_API_KEY in production to enable direct email delivery."
        : "Mensaje validado correctamente. Configura RESEND_API_KEY en producción para habilitar el envío directo por correo.",
      debugInfo: buildDebugInfo({
        requestId,
        stage: "missing-env-demo-fallback",
        detail: `Missing env vars: ${missing.join(", ")}`,
      }),
    };
  }

  const safeSubjectName = name.replace(/[\r\n]+/g, " ");

  console.info(tag, "Sending email via Resend API", {
    from: fromEmail,
    to: contactToEmail,
    replyTo: email,
  });

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [contactToEmail],
        reply_to: email,
        subject: `[Portafolio] Nuevo mensaje de ${safeSubjectName}`,
        text: `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`,
      }),
      signal: AbortSignal.timeout(10000),
    });

    const elapsedMs = Date.now() - startedAt;
    const rawBody = await response.text();
    let parsedBody: Record<string, unknown> | null = null;
    try {
      parsedBody = rawBody
        ? (JSON.parse(rawBody) as Record<string, unknown>)
        : null;
    } catch {
      parsedBody = null;
    }

    if (!response.ok) {
      console.error(tag, "Resend API rejected request", {
        status: response.status,
        statusText: response.statusText,
        elapsedMs,
        responseBody: parsedBody ?? rawBody,
      });
      return {
        status: "error",
        message: isEn
          ? "Could not send the message right now. Please try again or email me directly."
          : "No se pudo enviar el mensaje en este momento. Intenta de nuevo o escríbeme directamente por correo.",
        debugInfo: buildDebugInfo({
          requestId,
          stage: "resend-http-error",
          resendStatus: response.status,
          detail:
            typeof parsedBody?.message === "string"
              ? parsedBody.message
              : rawBody || response.statusText,
        }),
      };
    }

    const emailId =
      typeof parsedBody?.id === "string" ? parsedBody.id : undefined;

    console.info(tag, "Resend API accepted email", {
      status: response.status,
      elapsedMs,
      emailId: emailId ?? "unknown",
    });

    return {
      status: "success",
      message: isEn
        ? "Message sent successfully. Thanks for reaching out—I'll get back to you soon."
        : "Mensaje enviado correctamente. Gracias por escribir, te responderé pronto.",
      debugInfo: buildDebugInfo({
        requestId,
        stage: "resend-sent",
        resendStatus: response.status,
        emailId,
      }),
    };
  } catch (error) {
    const elapsedMs = Date.now() - startedAt;
    const err = error instanceof Error ? error : new Error(String(error));

    console.error(tag, "Resend fetch threw an exception", {
      name: err.name,
      message: err.message,
      cause: err.cause ? String(err.cause) : undefined,
      elapsedMs,
    });

    return {
      status: "error",
      message: isEn
        ? "Connection error while sending the message. Please try again or email me directly."
        : "Error de conexión al enviar el mensaje. Intenta de nuevo o escríbeme directamente por correo.",
      debugInfo: buildDebugInfo({
        requestId,
        stage: "resend-network-exception",
        detail: `${err.name}: ${err.message}`,
      }),
    };
  }
}
