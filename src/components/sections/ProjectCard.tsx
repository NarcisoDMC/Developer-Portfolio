"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { ProjectItem } from "@/types/portfolio";
import {
  EASE_EDITORIAL,
  SPRING_SNAPPY,
} from "@/components/motion/ScrollReveal";

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  onSelect: (project: ProjectItem) => void;
}

export function ProjectCard({ project, index, onSelect }: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      className="project-card"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.54,
        delay: index * 0.09,
        ease: EASE_EDITORIAL,
      }}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <header className="project-card-header">
        <div className="project-card-header-top">
          <h3 className="project-card-title">
            <button
              type="button"
              className="card-trigger"
              onClick={() => onSelect(project)}
            >
              {project.title}
            </button>
          </h3>
          <motion.span
            className="project-card-arrow font-mono-tech"
            aria-hidden="true"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    x: isHovered ? 2 : 0,
                    y: isHovered ? -2 : 0,
                    opacity: isHovered ? 1 : 0.45,
                  }
            }
            transition={SPRING_SNAPPY}
          >
            ↗
          </motion.span>
        </div>
        {project.subtitle ? (
          <p className="project-card-subtitle">{project.subtitle}</p>
        ) : null}
      </header>

      <p className="project-card-desc">{project.description}</p>

      <div className="project-card-media" data-surface={project.logoSurface}>
        {/* Native image keeps SVG rendering isolated so Inkscape IDs never collide across cards. */}
        <motion.img
          src={project.logoSrc}
          alt={project.logoAlt}
          width={project.logoWidth}
          height={project.logoHeight}
          loading="eager"
          decoding="async"
          className="project-card-logo"
          animate={
            shouldReduceMotion
              ? undefined
              : { scale: isHovered ? 1.03 : 1 }
          }
          transition={SPRING_SNAPPY}
        />
      </div>

      <footer className="project-card-footer">
        <span className="project-card-stack font-mono-tech">
          {project.stack.join(" · ")}
        </span>
      </footer>
    </motion.article>
  );
}
