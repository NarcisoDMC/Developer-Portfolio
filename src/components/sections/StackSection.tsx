"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  FadeInBlock,
  ScrollytellingSection,
  SPRING_SNAPPY,
  StaggerGrid,
  StaggerItem,
} from "@/components/motion/ScrollReveal";
import "./StackSection.css";

export function StackSection() {
  const { data } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const { stackSection, ui } = data;
  const { pillars } = stackSection;

  return (
    <section
      id="stack"
      tabIndex={-1}
      aria-labelledby="stack-heading"
      className="stack-section"
    >
      <ScrollytellingSection offset={["start 95%", "start 55%"]}>
        <div className="portfolio-container">
          <FadeInBlock>
            <SectionHeading
              eyebrow={stackSection.eyebrow}
              title={stackSection.title}
              subtitle={stackSection.subtitle}
              id="stack-heading"
            />
          </FadeInBlock>

          <StaggerGrid className="stack-grid">
            {pillars.map((pillar) => (
              <StaggerItem key={pillar.id}>
                <motion.article
                  className="stack-card"
                  whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                  transition={SPRING_SNAPPY}
                >
                  <div className="stack-card-top">
                    <span className="stack-index font-mono-tech">
                      {pillar.indexLabel}
                    </span>
                    <h3 className="stack-card-title">{pillar.title}</h3>
                    <p className="stack-card-focus">{pillar.focus}</p>
                  </div>

                  <ul
                    className="stack-tags"
                    aria-label={`${ui.stackTechnologiesAriaPrefix} ${pillar.title}`}
                  >
                    {pillar.technologies.map((tech) => (
                      <li key={tech} className="stack-tag font-mono-tech">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </ScrollytellingSection>
    </section>
  );
}
