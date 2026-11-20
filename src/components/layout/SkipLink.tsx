"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import "./SiteHeader.css";

/**
 * Accessible skip link allowing keyboard users to bypass the sticky header
 * and jump straight to the main content landmark.
 */
export function SkipLink() {
  const { data } = useLanguage();
  return (
    <a href="#contenido-principal" className="skip-link visually-hidden">
      {data.ui.skipToContent}
    </a>
  );
}
