"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  FadeInBlock,
  ScrollytellingSection,
  SPRING_SNAPPY,
} from "@/components/motion/ScrollReveal";
import "./GitHubSection.css";

export function GitHubSection() {
  const { data } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const { githubSection, ui } = data;
  const { whenlyBanner } = githubSection;

  return (
    <section
      id="github"
      tabIndex={-1}
      aria-labelledby="github-heading"
      className="github-section"
    >
      <ScrollytellingSection offset={["start 95%", "start 55%"]}>
        <div className="portfolio-container">
          <FadeInBlock>
            <SectionHeading
              eyebrow={githubSection.eyebrow}
              title={githubSection.title}
              subtitle={githubSection.subtitle}
              id="github-heading"
            />
          </FadeInBlock>

          <FadeInBlock delay={0.06}>
            <div className="github-profile-card">
              <div className="github-profile-main">
                <div className="github-identity">
                  <span className="github-icon-badge" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      focusable="false"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                  </span>
                  <h3 className="github-handle font-mono-tech">
                    {githubSection.handle}
                  </h3>
                </div>

                <p className="github-bio">{githubSection.bio}</p>

                <ul
                  className="github-highlights"
                  aria-label={ui.githubFocusAreasAriaLabel}
                >
                  {githubSection.highlights.map((item) => (
                    <li
                      key={item}
                      className="github-highlight-pill font-mono-tech"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="github-profile-actions">
                <motion.a
                  href={githubSection.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-profile-cta"
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  transition={SPRING_SNAPPY}
                >
                  <span>{githubSection.profileCtaLabel}</span>
                  <span aria-hidden="true">↗</span>
                  <span className="visually-hidden">
                    {ui.opensInNewTab}
                  </span>
                </motion.a>
              </div>
            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.12}>
            <motion.aside
              className="whenly-banner"
              aria-labelledby="whenly-banner-heading"
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              transition={SPRING_SNAPPY}
            >
              <div className="whenly-banner-main">
                <div className="whenly-banner-meta">
                  <span className="whenly-banner-eyebrow font-mono-tech">
                    <span className="whenly-banner-dot" aria-hidden="true" />
                    <span>{whenlyBanner.eyebrow}</span>
                  </span>
                  <span className="whenly-banner-status font-mono-tech">
                    {whenlyBanner.statusLabel}
                  </span>
                </div>

                <h3
                  id="whenly-banner-heading"
                  className="whenly-banner-title"
                >
                  {whenlyBanner.name}
                </h3>
                <p className="whenly-banner-desc">{whenlyBanner.description}</p>

                <ul
                  className="whenly-banner-features"
                  aria-label={ui.whenlyFeaturesAriaLabel}
                >
                  {whenlyBanner.features.map((feature) => (
                    <li
                      key={feature}
                      className="whenly-banner-feature font-mono-tech"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="whenly-banner-actions">
                <motion.a
                  href={whenlyBanner.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whenly-banner-cta"
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  transition={SPRING_SNAPPY}
                >
                  <span>{whenlyBanner.ctaLabel}</span>
                  <span aria-hidden="true">↗</span>
                  <span className="visually-hidden">
                    {ui.opensInNewTab}
                  </span>
                </motion.a>
              </div>
            </motion.aside>
          </FadeInBlock>
        </div>
      </ScrollytellingSection>
    </section>
  );
}
