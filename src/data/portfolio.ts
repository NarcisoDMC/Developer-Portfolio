import type { PortfolioData } from "@/types/portfolio";

const GITHUB_URL = "https://github.com/NarcisoDMC";
const LINKEDIN_URL = "https://www.linkedin.com/in/davidalexisdelatorre/";
const CONTACT_EMAIL = "davidalexisdelatorre@gmail.com";

export const portfolioData: PortfolioData = {
  brandName: "DAVID ALEXIS",
  brandBadge: "Full-Stack & AI",
  footerLabel: "PORTFOLIO 2026",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://davidalexis.dev",
  navItems: [
    {
      id: "proyectos",
      label: "Proyectos",
      href: "#proyectos",
    },
    {
      id: "stack",
      label: "Stack",
      href: "#stack",
    },
    {
      id: "github",
      label: "GitHub",
      href: "#github",
    },
    {
      id: "contacto",
      label: "Contacto",
      href: "#contacto",
    },
  ],
  hero: {
    avatarSrc: "/images/profile-david.jpg",
    avatarAlt: "Retrato de David Alexis, Full-Stack & AI Engineer",
    titleLead: "Full-",
    titleAccent: "Stack",
    titleTail: " & AI Engineer",
    subtitle:
      "Ingeniero en Sistemas Computacionales. Desarrollo de herramientas web, optimización de sistemas y soluciones de IA.",
    secondaryCta: {
      label: "Ver Proyectos",
      href: "#proyectos",
    },
    primaryCta: {
      label: "Contacto",
      href: "#contacto",
    },
  },
  projectsSection: {
    eyebrow: "01 / PROYECTOS DESTACADOS",
    foldNextLabel: "Ir a Stack & Arquitectura IA",
    foldNextHref: "#stack",
    items: [
      {
        id: "optigo-ai",
        title: "OptiGo AI",
        subtitle: "HackMTY 2025 / Reto Infosys",
        description:
          "Sistema de despacho y simulación para repartidores independientes mediante IA.",
        logoSrc: "/images/projects/optigo-logo.svg",
        logoAlt: "Logotipo oficial de OptiGo AI",
        logoSurface: "dark-blue",
        logoWidth: 300,
        logoHeight: 305,
        stack: ["Django", "Next.js", "OR-Tools", "DeepSeek"],
        role: "Full-Stack & Optimization Engineer",
        year: "2025",
        challenge:
          "Coordinar rutas de reparto independientes bajo ventanas de tiempo dinámicas, reduciendo kilómetros en vacío y tiempos de espera en despacho.",
        architecture:
          "Motor de optimización combinatoria VRP construido en Django + Google OR-Tools acoplado con DeepSeek para explicar decisiones de despacho y simular escenarios en tiempo real desde Next.js.",
        highlights: [
          "Resolución de enrutamiento multi-parada (VRP) con restricciones de capacidad y prioridad.",
          "Asistente analítico con DeepSeek para simular reasignaciones ante picos de demanda.",
          "Panel operativo en Next.js con telemetría de rutas y métricas de eficiencia.",
        ],
        impact:
          "Prototipo funcional presentado en HackMTY / Reto Infosys demostrando reducción simulada de tiempos muertos de despacho.",
        repoUrl: "https://github.com/alo-py/Reto-Infosys",
        repoLabel: "Ver repositorio en GitHub",
      },
      {
        id: "librerio-app",
        title: "Librerio App",
        description:
          "Plataforma social de lectura con asistente conversacional e IA generativa.",
        logoSrc: "/images/projects/librerio-logo.svg",
        logoAlt: "Logotipo oficial de Librerio App",
        logoSurface: "dark-purple",
        logoWidth: 1200,
        logoHeight: 900,
        stack: ["Next.js", "Express", "TS", "Supabase"],
        role: "Lead Full-Stack Developer",
        year: "2025",
        challenge:
          "Unir comunidad lectora, seguimiento de hábitos y recomendaciones contextuales sin spoilers mediante IA generativa.",
        architecture:
          "Frontend SSR/RSC en Next.js con TypeScript, API REST en Express para orquestación de prompts y persistencia/autenticación en Supabase (PostgreSQL + RLS).",
        highlights: [
          "Asistente conversacional consciente del progreso de lectura para evitar spoilers.",
          "Gestión de estanterías, reseñas y listas colaborativas con políticas RLS en Supabase.",
          "Contratos tipados de extremo a extremo entre Express y el cliente Next.js.",
        ],
        impact:
          "Experiencia fluida orientada a retención de lectura y descubrimiento asistido por contexto semántico.",
        liveUrl: "https://librerio-app.vercel.app/",
        liveLabel: "Página web",
        // TODO: Reemplaza con el enlace directo al repositorio específico de Librerio si es público
        repoUrl: "https://github.com/NarcisoDMC/LibrerioApp-Official",
        repoLabel: "Repositorio en GitHub",
      },
      {
        id: "cosmolights",
        title: "CosmoLights",
        description:
          "Controlador de hardware e interfaz USB de escritorio de código abierto.",
        logoSrc: "/images/projects/cosmolight-logo.svg",
        logoAlt: "Logotipo oficial de CosmoLights",
        logoSurface: "dark-indigo",
        logoWidth: 200,
        logoHeight: 180,
        stack: ["Python", "React", "Serial / USB"],
        role: "Systems & Desktop Interface Engineer",
        year: "2025",
        challenge:
          "Controlar iluminación física por comunicación serial/USB con baja latencia y una interfaz moderna accesible para creadores.",
        architecture:
          "Daemon de comunicación serial en Python conectado por puente local con una interfaz reactiva en React para escenas, perfiles de color y sincronización en vivo.",
        highlights: [
          "Detección automática de puertos Serial/USB y reconexión tolerante a fallos.",
          "Protocolo de tramas compacto para transiciones de color sin parpadeos.",
          "Arquitectura modular de código abierto pensada para extender efectos personalizados.",
        ],
        impact:
          "Integración directa hardware-software que reemplaza utilidades propietarias cerradas por un flujo abierto y extensible.",
        repoUrl: "https://github.com/NarcisoDMC/CosmoLights",
        repoLabel: "Repositorio en GitHub",
      },
    ],
  },
  stackSection: {
    eyebrow: "02 / STACK & ARQUITECTURA IA",
    title: "Ingeniería de producto, optimización e inteligencia aplicada",
    subtitle:
      "Construyo sistemas completos desde la interfaz optimizada para Core Web Vitals hasta motores de optimización, pipelines con LLMs y control de hardware.",
    pillars: [
      {
        id: "frontend-ui",
        indexLabel: "01",
        title: "Frontend & UI Systems",
        focus:
          "Interfaces de alto rendimiento con arquitectura Server-First, accesibilidad WCAG y CSS moderno sin dependencias pesadas.",
        technologies: [
          "Next.js",
          "React 19",
          "TypeScript",
          "Tailwind CSS",
          "CSS Grid / Subgrid",
          "Core Web Vitals",
        ],
      },
      {
        id: "backend-data",
        indexLabel: "02",
        title: "Backend & Datos",
        focus:
          "APIs robustas, modelado relacional seguro y servicios desacoplados listos para escalar.",
        technologies: [
          "Django",
          "Python",
          "Node.js",
          "Express",
          "Supabase",
          "PostgreSQL",
        ],
      },
      {
        id: "ai-optimization",
        indexLabel: "03",
        title: "IA & Optimización",
        focus:
          "Integración práctica de modelos generativos junto con algoritmos clásicos de investigación de operaciones.",
        technologies: [
          "DeepSeek",
          "LLMs & Prompts",
          "OR-Tools",
          "Asistentes RAG",
          "Simulación VRP",
        ],
      },
      {
        id: "systems-hardware",
        indexLabel: "04",
        title: "Sistemas & Hardware",
        focus:
          "Conectividad a bajo nivel, herramientas de escritorio, automatización y despliegue reproducible.",
        technologies: [
          "Serial / USB",
          "Apps de Escritorio",
          "Linux",
          "Docker",
          "Git & CI/CD",
        ],
      },
    ],
  },
  githubSection: {
    eyebrow: "03 / GITHUB & OPEN SOURCE",
    title: "Código abierto, arquitectura y despliegues en producción",
    subtitle:
      "Explora mis repositorios activos y proyectos publicados con arquitecturas Full-Stack, motores de optimización y herramientas de hardware.",
    handle: "@NarcisoDMC",
    profileUrl: GITHUB_URL,
    profileCtaLabel: "Visitar perfil en GitHub",
    bio: "Ingeniero en Sistemas Computacionales enfocado en aplicaciones web rápidas, modelos de optimización e integraciones con IA y hardware.",
    highlights: ["Full-Stack & IA", "Optimización VRP", "Hardware / USB"],
    whenlyBanner: {
      eyebrow: "EN DESARROLLO · NUEVA IDEA",
      name: "Whenly App",
      description:
        "Aplicación web para organizar tareas, recordatorios y notas, diseñada especialmente para adultos con poca afinidad a la tecnología que buscan llevar el orden de sus negocios y actividades diarias sin fricción.",
      features: [
        "Tareas y recordatorios simples",
        "Notas para negocios y rutina",
        "Interfaz clara y accesible",
      ],
      statusLabel: "Próximamente",
      ctaLabel: "Seguir avances en GitHub",
      ctaHref: GITHUB_URL,
    },
  },
  contactSection: {
    eyebrow: "04 / CONTACTO",
    title: "Construyamos software sólido e inteligente",
    contact: {
      heading: "Disponible para proyectos y colaboraciones",
      description:
        "¿Buscas un perfil Full-Stack & AI para desarrollar un producto web, optimizar procesos o integrar inteligencia artificial en producción? Escríbeme directamente.",
      availability: "Disponible para roles Full-Stack / AI & consultoría técnica",
      location: "México · Remoto / Híbrido",
      email: CONTACT_EMAIL,
      githubUrl: GITHUB_URL,
      linkedinUrl: LINKEDIN_URL,
      formHeading: "Envíame un mensaje",
    },
  },
};
