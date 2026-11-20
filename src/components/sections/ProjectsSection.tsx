"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { PortfolioData, ProjectItem } from "@/types/portfolio";
import {
  FadeInBlock,
  ScrollytellingSection,
  SPRING_SNAPPY,
} from "@/components/motion/ScrollReveal";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetailDialog } from "./ProjectDetailDialog";
import "./ProjectsSection.css";

interface ProjectsSectionProps {
  projectsSection?: PortfolioData["projectsSection"];
  footerLabel?: string;
}

export function ProjectsSection({
  projectsSection,
  footerLabel,
}: ProjectsSectionProps) {
  const { data } = useLanguage();
  const resolvedProjectsSection = projectsSection ?? data.projectsSection;
  const resolvedFooterLabel = footerLabel ?? data.footerLabel;

  const shouldReduceMotion = useReducedMotion();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  const selectedProject = useMemo<ProjectItem | null>(() => {
    if (!selectedProjectId) return null;
    return (
      resolvedProjectsSection.items.find(
        (item) => item.id === selectedProjectId,
      ) ?? null
    );
  }, [resolvedProjectsSection.items, selectedProjectId]);

  const handleSelect = useCallback((project: ProjectItem) => {
    setSelectedProjectId(project.id);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedProjectId(null);
  }, []);

  return (
    <section
      id="proyectos"
      aria-labelledby="proyectos-heading"
      tabIndex={-1}
      className="projects-section"
    >
      <ScrollytellingSection offset={["start 98%", "start 82%"]}>
        <div className="portfolio-container">
          <FadeInBlock>
            <SectionHeading
              eyebrow={resolvedProjectsSection.eyebrow}
              id="proyectos-heading"
            />
          </FadeInBlock>

          <div className="projects-grid">
            {resolvedProjectsSection.items.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onSelect={handleSelect}
              />
            ))}
          </div>

          <FadeInBlock delay={0.14}>
            <div className="projects-fold-bar">
              <span
                className="font-mono-tech text-xs tracking-[0.06em]"
                style={{ color: "var(--text-muted)" }}
              >
                {resolvedFooterLabel}
              </span>
              <motion.a
                href={resolvedProjectsSection.foldNextHref}
                className="fold-cue font-mono-tech"
                aria-label={resolvedProjectsSection.foldNextLabel}
                whileHover={shouldReduceMotion ? undefined : { y: 2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                transition={SPRING_SNAPPY}
              >
                [ ↓ ]
              </motion.a>
            </div>
          </FadeInBlock>
        </div>
      </ScrollytellingSection>

      <ProjectDetailDialog project={selectedProject} onClose={handleClose} />
    </section>
  );
}
