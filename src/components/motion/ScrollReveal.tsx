"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

export const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;

export const SPRING_SNAPPY = {
  type: "spring",
  stiffness: 360,
  damping: 30,
  mass: 0.8,
} as const;

export function ScrollProgressBar() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="scroll-progress-bar"
      style={{
        position: "fixed",
        insetBlockStart: 0,
        insetInline: 0,
        blockSize: "2px",
        zIndex: 60,
        pointerEvents: "none",
        transformOrigin: "0% 50%",
        background:
          "linear-gradient(90deg, rgba(148, 194, 222, 0.28) 0%, rgba(241, 245, 249, 0.62) 100%)",
        scaleX: shouldReduceMotion ? 0 : scaleX,
      }}
    />
  );
}

interface ScrollytellingSectionProps {
  children: ReactNode;
  className?: string;
  offset?: [
    `${"start" | "center" | "end"} ${number}%`,
    `${"start" | "center" | "end"} ${number}%`,
  ];
}

export function ScrollytellingSection({
  children,
  className,
  offset = ["start 92%", "start 42%"],
}: ScrollytellingSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.08, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [28, 0]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={
          shouldReduceMotion
            ? { opacity: 1, y: 0 }
            : { opacity, y }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}

interface FadeInBlockProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export function FadeInBlock({
  children,
  className,
  delay = 0,
  yOffset = 16,
}: FadeInBlockProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.58, delay, ease: EASE_EDITORIAL }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerGridProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerGrid({
  children,
  className,
  staggerDelay = 0.08,
}: StaggerGridProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={
        shouldReduceMotion
          ? undefined
          : {
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.52, ease: EASE_EDITORIAL },
              },
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
