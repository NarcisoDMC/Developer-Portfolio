export type QualityTier = "mobile" | "tablet" | "desktop";

export interface OrbitDefinition {
  /** Radio del anillo en unidades de escena. */
  radius: number;
  /** Grosor del tubo del toro. */
  thickness: number;
  /** Inclinación del anillo en radianes: [x, y, z]. */
  tilt: readonly [number, number, number];
  /** Velocidad angular de los fragmentos que recorren la órbita. */
  speed: number;
  /** Desfase inicial para que las órbitas no estén sincronizadas. */
  phase: number;
  /** Opacidad base del anillo. */
  opacity: number;
}

export interface OrbitSystemDefinition {
  offset: readonly [number, number, number];
  rotation: readonly [number, number, number];
  orbits: readonly OrbitDefinition[];
}

export interface FragmentBudget {
  icosa: number;
  octa: number;
}

export interface QualityDefinition {
  maxDpr: number;
  antialias: boolean;
  scale: number;
  primary: FragmentBudget;
  secondary: FragmentBudget;
}

export const glassOrbitsConfig = {
  /**
   * El fondo se puede apagar sin tocar código con:
   * NEXT_PUBLIC_GLASS_ORBITS=off
   */
  enabled: process.env.NEXT_PUBLIC_GLASS_ORBITS !== "off",
  colors: {
    ice: "#c7ecff",
    cyan: "#79d2ee",
    steel: "#5a8fb8",
    deep: "#2f5f7a",
  },
  camera: {
    fov: 42,
    near: 0.1,
    far: 60,
    z: 10.4,
  },
  pointer: {
    radius: 2.4,
    parallaxX: 0.38,
    parallaxY: 0.24,
    tiltX: 0.055,
    tiltY: 0.08,
  },
  motion: {
    maxFps: 60,
    pointerSmoothing: 6,
    cameraSmoothing: 2.2,
  },
  quality: {
    mobile: {
      maxDpr: 1.25,
      antialias: false,
      scale: 0.68,
      primary: { icosa: 12, octa: 4 },
      secondary: { icosa: 0, octa: 0 },
    },
    tablet: {
      maxDpr: 1.35,
      antialias: true,
      scale: 0.86,
      primary: { icosa: 18, octa: 5 },
      secondary: { icosa: 0, octa: 0 },
    },
    desktop: {
      maxDpr: 1.5,
      antialias: true,
      scale: 1,
      primary: { icosa: 22, octa: 7 },
      secondary: { icosa: 7, octa: 3 },
    },
  } satisfies Record<QualityTier, QualityDefinition>,
  systems: {
    primary: {
      offset: [0.25, -0.1, -0.8],
      rotation: [0.08, -0.12, 0.02],
      orbits: [
        {
          radius: 1.5,
          thickness: 0.014,
          tilt: [1.15, 0.4, -0.08],
          speed: 0.08,
          phase: 5.1,
          opacity: 0.22,
        },
        {
          radius: 2.2,
          thickness: 0.012,
          tilt: [0.55, 0.12, 0.06],
          speed: 0.055,
          phase: 0.4,
          opacity: 0.2,
        },
        {
          radius: 3,
          thickness: 0.011,
          tilt: [-0.42, 0.34, -0.14],
          speed: -0.038,
          phase: 2.1,
          opacity: 0.16,
        },
        {
          radius: 3.85,
          thickness: 0.01,
          tilt: [0.92, -0.18, 0.16],
          speed: 0.028,
          phase: 4.2,
          opacity: 0.13,
        },
        {
          radius: 4.8,
          thickness: 0.01,
          tilt: [-0.22, 0.1, 0.34],
          speed: -0.02,
          phase: 1.2,
          opacity: 0.1,
        },
      ],
    },
    secondary: {
      offset: [-4.2, 1.9, -2.8],
      rotation: [0.2, 0.35, -0.15],
      orbits: [
        {
          radius: 1.3,
          thickness: 0.01,
          tilt: [0.7, 0.28, 0.1],
          speed: -0.065,
          phase: 1.8,
          opacity: 0.16,
        },
        {
          radius: 1.8,
          thickness: 0.009,
          tilt: [-0.35, 0.55, 0.2],
          speed: 0.048,
          phase: 3.6,
          opacity: 0.12,
        },
      ],
    },
  } satisfies Record<"primary" | "secondary", OrbitSystemDefinition>,
} as const;
