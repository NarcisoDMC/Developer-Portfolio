"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { HeroData } from "@/types/portfolio";
import {
  EASE_EDITORIAL,
  SPRING_SNAPPY,
} from "@/components/motion/ScrollReveal";
import "./HeroSection.css";

export interface HeroSectionProps {
  hero?: HeroData;
}

/**
 * Above-the-fold Hero section preserving LCP avatar immediacy while adding
 * editorial staggered typography entrance and scrollytelling scroll depth.
 */
export function HeroSection({ hero }: HeroSectionProps) {
  const { data } = useLanguage();
  const resolvedHero = hero ?? data.hero;

  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const scrollOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, -32]);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      tabIndex={-1}
      className="hero-section"
    >
      <motion.div
        className="portfolio-container hero-inner"
        style={
          shouldReduceMotion
            ? undefined
            : { opacity: scrollOpacity, y: scrollY }
        }
      >
        <div className="hero-avatar-frame">
          <span className="hero-avatar-halo" aria-hidden="true" />
          <Image
            src={resolvedHero.avatarSrc}
            alt={resolvedHero.avatarAlt}
            width={112}
            height={112}
            quality={85}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="hero-avatar-img"
          />
        </div>

        <motion.h1
          id="contenido-principal"
          tabIndex={-1}
          className="hero-title"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.04, ease: EASE_EDITORIAL }}
        >
          <span lang="en">
            {resolvedHero.titleLead}
            <span className="hero-title-accent">{resolvedHero.titleAccent}</span>
            {resolvedHero.titleTail}
          </span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: EASE_EDITORIAL }}
        >
          {resolvedHero.subtitle}
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: EASE_EDITORIAL }}
        >
          <motion.a
            href={resolvedHero.secondaryCta.href}
            className="hero-cta hero-cta-secondary"
            whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            transition={SPRING_SNAPPY}
          >
            {resolvedHero.secondaryCta.label}{" "}
            <span className="font-mono-tech" aria-hidden="true">
              [↓]
            </span>
          </motion.a>
          <motion.a
            href={resolvedHero.primaryCta.href}
            className="hero-cta hero-cta-primary"
            whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            transition={SPRING_SNAPPY}
          >
            {resolvedHero.primaryCta.label}{" "}
            <span className="hero-cta-arrow" aria-hidden="true">
              →
            </span>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
