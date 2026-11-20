"use client";

import { motion, useReducedMotion } from "motion/react";
import { portfolioData } from "@/data/portfolio";
import type { NavItem } from "@/types/portfolio";
import { FadeInBlock, SPRING_SNAPPY } from "@/components/motion/ScrollReveal";

export interface SiteFooterProps {
  footerLabel?: string;
  navItems?: NavItem[];
}

/**
 * Minimalist footer landmark with glass hairline divider, year label,
 * compact secondary navigation, and accessible back-to-top link.
 */
export function SiteFooter({
  footerLabel = portfolioData.footerLabel,
  navItems = portfolioData.navItems,
}: SiteFooterProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <footer className="mt-16 pb-8 sm:mt-24 sm:pb-10">
      <FadeInBlock yOffset={12}>
        <div
          className="portfolio-container flex flex-col gap-5 pt-7 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderTop: "1px solid var(--glass-border)" }}
        >
          <p
            className="font-mono-tech text-xs font-medium uppercase tracking-[0.08em]"
            style={{ color: "var(--text-muted)" }}
          >
            {footerLabel}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end sm:gap-6">
            <nav aria-label="Pie de página">
              <ul className="m-0 flex list-none flex-wrap items-center gap-x-4 gap-y-2 p-0 sm:gap-x-5">
                {navItems.map((item) => {
                  const isExternal = Boolean(item.external);
                  return (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="inline-flex min-h-[44px] items-center rounded-[var(--radius-btn)] px-1.5 text-sm text-[var(--text-secondary)] no-underline transition-colors hover:text-[var(--text-primary)]"
                      >
                        <span>{item.label}</span>
                        {item.hasIndicatorDot ? (
                          <span
                            aria-hidden="true"
                            className="relative -top-[0.35em] ml-0.5 text-[0.75em] leading-none text-[var(--text-accent-muted)]"
                          >
                            °
                          </span>
                        ) : null}
                        {isExternal ? (
                          <span className="visually-hidden">
                            {" "}
                            (abre en nueva pestaña)
                          </span>
                        ) : null}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <motion.a
              href="#inicio"
              aria-label="Volver al inicio"
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              transition={SPRING_SNAPPY}
              className="font-mono-tech inline-flex items-center justify-center rounded-[var(--radius-btn)] border border-[var(--glass-border)] px-2.5 text-xs font-medium text-[var(--text-secondary)] no-underline transition-colors hover:border-[var(--glass-border-hover)] hover:text-[var(--text-primary)]"
              style={{
                minBlockSize: "44px",
                minInlineSize: "44px",
                background: "var(--glass-bg)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "var(--glass-highlight)",
              }}
            >
              [ ↑ ]
            </motion.a>
          </div>
        </div>
      </FadeInBlock>
    </footer>
  );
}
