"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { portfolioData } from "@/data/portfolio";
import type { NavItem } from "@/types/portfolio";
import {
  EASE_EDITORIAL,
  SPRING_SNAPPY,
} from "@/components/motion/ScrollReveal";
import "./SiteHeader.css";

export interface SiteHeaderProps {
  brandName?: string;
  brandBadge?: string;
  navItems?: NavItem[];
}

/**
 * Sticky frosted-glass site navigation header with spring active dot,
 * scroll-state elevation, and progressive scrollspy synchronization.
 */
export function SiteHeader({
  brandName = portfolioData.brandName,
  brandBadge = portfolioData.brandBadge,
  navItems = portfolioData.navItems,
}: SiteHeaderProps) {
  const navRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 12);
  });

  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    const cleanups: Array<() => void> = [];
    const navLinks = Array.from(navEl.querySelectorAll<HTMLAnchorElement>("a"));
    const fragmentTargetIds = new Set(
      navLinks
        .map((link) => link.getAttribute("href"))
        .filter((href): href is string => Boolean(href && href.startsWith("#")))
        .map((href) => href.slice(1)),
    );

    const hashId = window.location.hash.slice(1);
    if (hashId && fragmentTargetIds.has(hashId)) {
      queueMicrotask(() => setActiveId(hashId));
    }

    const supportsScrollTargetGroup =
      typeof CSS !== "undefined" && CSS.supports("scroll-target-group: auto");

    if (supportsScrollTargetGroup) {
      const syncFromNative = () => {
        const currentLink =
          navEl.querySelector<HTMLAnchorElement>("a:target-current");
        const href = currentLink?.getAttribute("href");
        if (href && href.startsWith("#")) {
          const nextId = href.slice(1);
          if (fragmentTargetIds.has(nextId)) {
            setActiveId(nextId);
            return;
          }
        }
        if (window.scrollY < 160) {
          setActiveId(null);
        }
      };

      document.addEventListener("scrollend", syncFromNative);
      window.addEventListener("hashchange", syncFromNative);
      cleanups.push(() => {
        document.removeEventListener("scrollend", syncFromNative);
        window.removeEventListener("hashchange", syncFromNative);
      });
    }

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main section[id]"),
    );

    if (sections.length > 0 && typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const id = entry.target.getAttribute("id");
            if (!id) continue;

            if (entry.isIntersecting) {
              if (fragmentTargetIds.has(id)) {
                setActiveId(id);
              } else if (id === "inicio") {
                setActiveId(null);
              }
            } else if (
              id === "proyectos" &&
              entry.boundingClientRect.top > 0
            ) {
              setActiveId(null);
            }
          }
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
      );

      for (const section of sections) {
        observer.observe(section);
      }

      cleanups.push(() => {
        observer.disconnect();
      });
    }

    return () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  }, [navItems]);

  return (
    <header
      className="site-header-sticky"
      data-stuck={isScrolled ? "true" : undefined}
    >
      <motion.div
        className="site-header-bar"
        initial={shouldReduceMotion ? false : { opacity: 0.92, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_EDITORIAL }}
      >
        <a href="#inicio" className="site-brand">
          <span className="site-brand-name">{brandName}</span>
          <span className="site-brand-badge">{brandBadge}</span>
        </a>

        <nav ref={navRef} aria-label="Principal" className="site-nav">
          <ul className="site-nav-list">
            {navItems.map((item) => {
              const isExternal = Boolean(item.external);
              const isActive = !isExternal && activeId === item.id;
              return (
                <li key={item.id} className="site-nav-item">
                  <a
                    href={item.href}
                    className={
                      isActive
                        ? "site-nav-link target-current"
                        : "site-nav-link"
                    }
                    aria-current={isActive ? "true" : undefined}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                  >
                    <span>{item.label}</span>
                    {item.hasIndicatorDot ? (
                      <span className="site-nav-ext-dot" aria-hidden="true">
                        °
                      </span>
                    ) : null}
                    {isExternal ? (
                      <span className="visually-hidden">
                        {" "}
                        (abre en nueva pestaña)
                      </span>
                    ) : null}
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active-dot"
                        className="site-nav-dot"
                        transition={SPRING_SNAPPY}
                        aria-hidden="true"
                      />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </motion.div>
    </header>
  );
}
