"use client";

import { useEffect, useId } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

/**
 * Accessible bilingual switch control (ES / EN) built on `<input type="checkbox" switch>`
 * with conditional `input-switch-polyfill` loading for non-Safari browsers.
 */
export function LanguageSwitch() {
  const switchId = useId();
  const { locale, setLocale, data } = useLanguage();
  const isEnglish = locale === "en";

  useEffect(() => {
    if (
      typeof HTMLInputElement !== "undefined" &&
      !("switch" in HTMLInputElement.prototype)
    ) {
      void import("input-switch-polyfill");
    }
  }, []);

  return (
    <label htmlFor={switchId} className="lang-switch">
      <span className="visually-hidden">
        {data.ui.languageSwitchPrefix} (
      </span>
      <span
        className="lang-switch-code font-mono-tech"
        data-active={!isEnglish ? "true" : undefined}
      >
        ES
      </span>
      <input
        id={switchId}
        type="checkbox"
        {...({ switch: "" } as Record<string, string>)}
        checked={isEnglish}
        onChange={(event) => setLocale(event.target.checked ? "en" : "es")}
        className="lang-switch-input"
      />
      <span
        className="lang-switch-code font-mono-tech"
        data-active={isEnglish ? "true" : undefined}
      >
        EN
      </span>
      <span className="visually-hidden">
        ): {data.ui.languageSwitchTarget}
      </span>
    </label>
  );
}
