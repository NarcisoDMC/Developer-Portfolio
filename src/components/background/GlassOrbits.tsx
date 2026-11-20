"use client";

import { useEffect, useRef, useState } from "react";
import { glassOrbitsConfig } from "./config";
import type { GlassOrbitsHandle } from "./scene";
import "./GlassOrbits.css";

type Status = "idle" | "ready" | "failed";

/**
 * Fixed, decorative WebGL background.
 *
 * Three.js is imported dynamically so it never enters the initial bundle or
 * the server render. The canvas stays invisible until the first frame is
 * painted, and the effect is skipped entirely for reduced motion or forced
 * colors.
 */
export function GlassOrbits() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (!glassOrbitsConfig.enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forcedColors = window.matchMedia("(forced-colors: active)");

    let disposed = false;
    let booting = false;
    let handle: GlassOrbitsHandle | null = null;
    let idleId: number | null = null;
    let timeoutId: number | null = null;

    const canAnimate = () => !reducedMotion.matches && !forcedColors.matches;

    const clearScheduled = () => {
      if (idleId !== null) {
        window.cancelIdleCallback?.(idleId);
        idleId = null;
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const teardown = () => {
      clearScheduled();
      handle?.dispose();
      handle = null;
      booting = false;
      setStatus("idle");
    };

    const boot = async () => {
      if (disposed || booting || !canAnimate()) return;
      booting = true;

      try {
        const { createGlassOrbits } = await import("./scene");

        if (disposed || !canAnimate()) {
          booting = false;
          return;
        }

        handle = createGlassOrbits(canvas, {
          onReady: () => {
            if (!disposed) {
              setStatus("ready");
            }
          },
          onFailure: () => {
            if (!disposed) {
              setStatus("failed");
            }
          },
        });

        if (!handle) {
          booting = false;
        }
      } catch {
        if (!disposed) {
          setStatus("failed");
        }
        booting = false;
      }
    };

    const schedule = () => {
      if (disposed || !canAnimate() || handle || booting) return;

      if (window.requestIdleCallback) {
        idleId = window.requestIdleCallback(
          () => {
            idleId = null;
            void boot();
          },
          { timeout: 1200 },
        );
      } else {
        timeoutId = window.setTimeout(() => {
          timeoutId = null;
          void boot();
        }, 250);
      }
    };

    const onPreferenceChange = () => {
      if (canAnimate()) {
        schedule();
      } else {
        teardown();
      }
    };

    schedule();

    reducedMotion.addEventListener("change", onPreferenceChange);
    forcedColors.addEventListener("change", onPreferenceChange);

    return () => {
      disposed = true;
      reducedMotion.removeEventListener("change", onPreferenceChange);
      forcedColors.removeEventListener("change", onPreferenceChange);
      clearScheduled();
      handle?.dispose();
      handle = null;
    };
  }, []);

  if (!glassOrbitsConfig.enabled) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="glass-orbits"
      data-ready={status === "ready" ? "true" : undefined}
      data-failed={status === "failed" ? "true" : undefined}
      aria-hidden="true"
    />
  );
}
