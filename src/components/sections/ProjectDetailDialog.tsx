"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ProjectItem } from "@/types/portfolio";
import {
  EASE_EDITORIAL,
  SPRING_SNAPPY,
} from "@/components/motion/ScrollReveal";

interface ProjectDetailDialogProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectDetailDialog({
  project,
  onClose,
}: ProjectDetailDialogProps) {
  const titleId = useId();
  const shouldReduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | undefined>(undefined);

  const [prevProject, setPrevProject] = useState<ProjectItem | null>(project);
  const [renderedProject, setRenderedProject] = useState<ProjectItem | null>(
    project,
  );
  const [isVisible, setIsVisible] = useState(Boolean(project));

  // React-recommended render-time sync only when the incoming prop identity changes
  if (project !== prevProject) {
    setPrevProject(project);
    if (project) {
      setRenderedProject(project);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }

  const startClose = useCallback(() => {
    setIsVisible(false);
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      const dialog = dialogRef.current;
      if (dialog && dialog.open) {
        dialog.close();
      }
    }, 350);
  }, []);

  const handleExitComplete = useCallback(() => {
    window.clearTimeout(closeTimerRef.current);
    const dialog = dialogRef.current;
    if (dialog && dialog.open) {
      dialog.close();
      return;
    }
    setRenderedProject(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !project) return;

    window.clearTimeout(closeTimerRef.current);
    if (!dialog.open) {
      dialog.showModal();
    }
    if (bodyRef.current) {
      bodyRef.current.scrollTop = 0;
    }
    if (
      closeBtnRef.current &&
      document.activeElement !== closeBtnRef.current
    ) {
      closeBtnRef.current.focus({ preventScroll: true });
    }
  }, [project]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
      if (!isVisible) {
        window.clearTimeout(closeTimerRef.current);
        if (dialog.open) {
          dialog.close();
        }
        return;
      }
      startClose();
    };

    const handleNativeClose = () => {
      window.clearTimeout(closeTimerRef.current);
      dialog.returnValue = "";
      setIsVisible(false);
      setRenderedProject(null);
      onClose();
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("close", handleNativeClose);

    const isOutside = (e: PointerEvent) => {
      const targetEl = surfaceRef.current ?? dialog;
      const r = targetEl.getBoundingClientRect();
      return (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      );
    };

    let pressedOutside = false;
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) {
        pressedOutside = false;
        return;
      }
      pressedOutside = isOutside(e);
    };

    const onPointerUp = (e: PointerEvent) => {
      const shouldClose = pressedOutside && isOutside(e);
      pressedOutside = false;
      if (shouldClose) {
        e.preventDefault();
        startClose();
      }
    };

    dialog.addEventListener("pointerdown", onPointerDown);
    dialog.addEventListener("pointerup", onPointerUp);

    return () => {
      window.clearTimeout(closeTimerRef.current);
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("close", handleNativeClose);
      dialog.removeEventListener("pointerdown", onPointerDown);
      dialog.removeEventListener("pointerup", onPointerUp);
    };
  }, [isVisible, onClose, startClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="project-dialog"
      {...({ closedby: "any" } as Record<string, string>)}
    >
      <AnimatePresence onExitComplete={handleExitComplete}>
        {isVisible && renderedProject ? (
          <motion.div
            ref={surfaceRef}
            key={renderedProject.id}
            className="project-dialog-surface"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 12 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 8 }
            }
            transition={{
              duration: shouldReduceMotion ? 0.12 : 0.24,
              ease: EASE_EDITORIAL,
            }}
          >
            <header className="project-dialog-header">
              <div className="project-dialog-heading-group">
                <p className="project-dialog-badge font-mono-tech">
                  {renderedProject.role} · {renderedProject.year}
                </p>
                <h2 id={titleId} className="project-dialog-title">
                  {renderedProject.title}
                </h2>
                {renderedProject.subtitle ? (
                  <p className="project-dialog-subtitle">
                    {renderedProject.subtitle}
                  </p>
                ) : null}
              </div>

              <motion.button
                ref={closeBtnRef}
                type="button"
                onClick={startClose}
                aria-label="Cerrar detalle del proyecto"
                autoFocus
                className="dialog-close-btn"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                transition={SPRING_SNAPPY}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.button>
            </header>

            <div ref={bodyRef} className="project-dialog-body">
              <div
                className="project-dialog-media"
                data-surface={renderedProject.logoSurface}
              >
                {/* Native <img> keeps SVG rendering isolated so Inkscape IDs never collide. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={renderedProject.logoSrc}
                  alt={renderedProject.logoAlt}
                  width={renderedProject.logoWidth}
                  height={renderedProject.logoHeight}
                  decoding="async"
                  className="project-dialog-logo"
                />
              </div>

              <p className="project-dialog-lead">
                {renderedProject.description}
              </p>

              <div className="project-dialog-sections">
                <section className="project-dialog-section">
                  <h3 className="project-dialog-section-title font-mono-tech">
                    Desafío
                  </h3>
                  <p className="project-dialog-section-text">
                    {renderedProject.challenge}
                  </p>
                </section>

                <section className="project-dialog-section">
                  <h3 className="project-dialog-section-title font-mono-tech">
                    Arquitectura Técnica
                  </h3>
                  <p className="project-dialog-section-text">
                    {renderedProject.architecture}
                  </p>
                </section>

                <section className="project-dialog-section">
                  <h3 className="project-dialog-section-title font-mono-tech">
                    Puntos Clave
                  </h3>
                  <ul className="project-dialog-highlights">
                    {renderedProject.highlights.map((highlight) => (
                      <li key={highlight} className="project-dialog-highlight-item">
                        <span
                          className="project-dialog-bullet"
                          aria-hidden="true"
                        >
                          •
                        </span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="project-dialog-section">
                  <h3 className="project-dialog-section-title font-mono-tech">
                    Impacto
                  </h3>
                  <p className="project-dialog-section-text">
                    {renderedProject.impact}
                  </p>
                </section>

                <section className="project-dialog-section">
                  <h3 className="project-dialog-section-title font-mono-tech">
                    Tech Stack
                  </h3>
                  <ul className="project-dialog-stack">
                    {renderedProject.stack.map((tech) => (
                      <li
                        key={tech}
                        className="project-dialog-pill font-mono-tech"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>

            {renderedProject.repoUrl || renderedProject.liveUrl ? (
              <footer
                className={
                  renderedProject.repoUrl && renderedProject.liveUrl
                    ? "project-dialog-footer project-dialog-footer-split"
                    : "project-dialog-footer"
                }
              >
                {renderedProject.liveUrl ? (
                  <motion.a
                    href={renderedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-dialog-link project-dialog-link-primary"
                    whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    transition={SPRING_SNAPPY}
                  >
                    <span>{renderedProject.liveLabel ?? "Página web"}</span>
                    <span aria-hidden="true">↗</span>
                    <span className="visually-hidden">
                      (abre en nueva pestaña)
                    </span>
                  </motion.a>
                ) : null}
                {renderedProject.repoUrl ? (
                  <motion.a
                    href={renderedProject.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-dialog-link project-dialog-link-secondary"
                    whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    transition={SPRING_SNAPPY}
                  >
                    <span>
                      {renderedProject.repoLabel ?? "Ver repositorio en GitHub"}
                    </span>
                    <span aria-hidden="true">↗</span>
                    <span className="visually-hidden">
                      (abre en nueva pestaña)
                    </span>
                  </motion.a>
                ) : null}
              </footer>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </dialog>
  );
}
