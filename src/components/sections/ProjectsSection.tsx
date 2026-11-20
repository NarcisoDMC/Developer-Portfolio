"use client";

import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { portfolioData } from "@/data/portfolio";
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
  projectsSection = portfolioData.projectsSection,
  footerLabel = portfolioData.footerLabel,
}: ProjectsSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null,
  );

  const handleClose = useCallback(() => {
    setSelectedProject(null);
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
              eyebrow={projectsSection.eyebrow}
              id="proyectos-heading"
            />
          </FadeInBlock>

          <div className="projects-grid">
            {projectsSection.items.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onSelect={setSelectedProject}
              />
            ))}
          </div>

          <FadeInBlock delay={0.14}>
            <div className="projects-fold-bar">
              <span
                className="font-mono-tech text-xs tracking-[0.06em]"
                style={{ color: "var(--text-muted)" }}
              >
                {footerLabel}
              </span>
              <motion.a
                href={projectsSection.foldNextHref}
                className="fold-cue font-mono-tech"
                aria-label={projectsSection.foldNextLabel}
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
