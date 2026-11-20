"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SPRING_SNAPPY } from "@/components/motion/ScrollReveal";

interface CopyEmailButtonProps {
  targetId: string;
  label?: string;
}

interface CommandLikeEvent extends Event {
  source?: Element | null;
  command?: string;
}

export function CopyEmailButton({
  targetId,
  label = "Copiar correo electrónico",
}: CopyEmailButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [tipStatus, setTipStatus] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const rafRef = useRef<number | undefined>(undefined);
  const lastMessageRef = useRef("");

  const report = useCallback((ok: boolean) => {
    const button = buttonRef.current;
    const tip = tipRef.current;
    if (!button || !tip) return;

    window.clearTimeout(timerRef.current);
    if (rafRef.current !== undefined) {
      window.cancelAnimationFrame(rafRef.current);
    }

    button.removeAttribute("data-copied");
    button.removeAttribute("data-failed");

    let message = ok ? "Copiado" : "No se pudo copiar";
    if (message === lastMessageRef.current) {
      message += "\u00A0";
    }
    lastMessageRef.current = message;

    tip.textContent = "";
    void button.offsetWidth;
    button.setAttribute(ok ? "data-copied" : "data-failed", "");
    setCopied(ok);
    setTipStatus(ok ? "copied" : "failed");

    rafRef.current = window.requestAnimationFrame(() => {
      if (tipRef.current) {
        tipRef.current.textContent = message;
      }
    });

    timerRef.current = window.setTimeout(() => {
      buttonRef.current?.removeAttribute("data-copied");
      buttonRef.current?.removeAttribute("data-failed");
      setCopied(false);
      setTipStatus("idle");
      if (tipRef.current) {
        tipRef.current.textContent = "";
      }
    }, 2200);
  }, []);

  const copyTarget = useCallback(async () => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const text =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
        ? target.value
        : (target.innerText || target.textContent || "").trim();

    if (!text) return;

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }
      await navigator.clipboard.writeText(text);
      report(true);
    } catch {
      report(false);
    }
  }, [report, targetId]);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    if ("CommandEvent" in window) {
      const handleCommand = (event: Event) => {
        const cmdEvent = event as CommandLikeEvent;
        if (cmdEvent.source === button && cmdEvent.command === "--copy") {
          void copyTarget();
        }
      };

      document.addEventListener("command", handleCommand, true);
      return () => {
        document.removeEventListener("command", handleCommand, true);
      };
    }

    const handleClick = () => {
      void copyTarget();
    };

    button.addEventListener("click", handleClick);
    return () => {
      button.removeEventListener("click", handleClick);
    };
  }, [copyTarget]);

  useEffect(() => {
    return () => {
      window.clearTimeout(timerRef.current);
      if (rafRef.current !== undefined) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <span className="copy-control">
      <motion.button
        ref={buttonRef}
        type="button"
        className="copy-button"
        {...({
          command: "--copy",
          commandfor: targetId,
        } as Record<string, string>)}
        aria-label={label}
        whileHover={shouldReduceMotion ? undefined : { y: -1 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
        transition={SPRING_SNAPPY}
      >
        <span className="copy-icon" aria-hidden="true">
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.svg
                key="check"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                focusable="false"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.16 }}
              >
                <path
                  d="M3.25 8.5L6.25 11.5L12.75 4.75"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            ) : (
              <motion.svg
                key="copy"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                focusable="false"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.16 }}
              >
                <rect
                  x="5.5"
                  y="5.5"
                  width="8"
                  height="8"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M10.5 5.5V4C10.5 3.17157 9.82843 2.5 9 2.5H4C3.17157 2.5 2.5 3.17157 2.5 4V9C2.5 9.82843 3.17157 10.5 4 10.5H5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </span>
        <span className="copy-btn-label">{copied ? "Copiado" : "Copiar"}</span>
      </motion.button>
      <motion.span
        ref={tipRef}
        className="copy-tip"
        role="status"
        animate={
          shouldReduceMotion
            ? { opacity: tipStatus !== "idle" ? 1 : 0 }
            : {
                opacity: tipStatus !== "idle" ? 1 : 0,
                y: tipStatus !== "idle" ? 0 : 4,
              }
        }
        transition={{ duration: 0.18 }}
      />
    </span>
  );
}
