import type { Locale, PortfolioData } from "@/types/portfolio";

const GITHUB_URL = "https://github.com/NarcisoDMC";
const LINKEDIN_URL = "https://www.linkedin.com/in/davidalexisdelatorre/";
const CONTACT_EMAIL = "davidalexisdelatorre@gmail.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://davidalexis.dev";

export const portfolioDataEs: PortfolioData = {
  brandName: "DAVID ALEXIS",
  brandBadge: "Full-Stack & AI",
  footerLabel: "PORTFOLIO 2026",
  siteUrl: SITE_URL,
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
      availability:
        "Disponible para roles Full-Stack / AI & consultoría técnica",
      location: "México · Remoto / Híbrido",
      email: CONTACT_EMAIL,
      githubUrl: GITHUB_URL,
      linkedinUrl: LINKEDIN_URL,
      formHeading: "Envíame un mensaje",
    },
  },
  ui: {
    pageTitle: "David Alexis | Ingeniero Full-Stack & IA",
    skipToContent: "Saltar al contenido principal",
    primaryNavAriaLabel: "Principal",
    footerNavAriaLabel: "Pie de página",
    backToTopAriaLabel: "Volver al inicio",
    opensInNewTab: "(abre en nueva pestaña)",
    languageSwitchPrefix: "Idioma",
    languageSwitchTarget: "activar inglés",
    projectDialog: {
      closeAriaLabel: "Cerrar detalle del proyecto",
      challengeHeading: "Desafío",
      architectureHeading: "Arquitectura Técnica",
      highlightsHeading: "Puntos Clave",
      impactHeading: "Impacto",
      techStackHeading: "Tech Stack",
      defaultLiveLabel: "Página web",
      defaultRepoLabel: "Ver repositorio en GitHub",
    },
    stackTechnologiesAriaPrefix: "Tecnologías de",
    githubFocusAreasAriaLabel: "Áreas de enfoque en GitHub",
    whenlyFeaturesAriaLabel: "Características clave de Whenly App",
    contact: {
      locationLabel: "Ubicación",
      directEmailLabel: "Correo directo",
      copyEmailAriaLabel: "Copiar correo electrónico",
      copyButtonIdle: "Copiar",
      copyButtonCopied: "Copiado",
      copyToastCopied: "Copiado",
      copyToastFailed: "No se pudo copiar",
      nameLabel: "Nombre",
      nameHint: "Mínimo 2 caracteres.",
      nameError: "Ingresa tu nombre (al menos 2 caracteres).",
      emailLabel: "Correo electrónico",
      emailHint: "Formato: tu@dominio.com",
      emailError:
        "Ingresa un correo electrónico válido (ejemplo: tu@dominio.com).",
      messageLabel: "Mensaje",
      messageHint:
        "Cuéntame sobre tu proyecto, objetivo o vacante (mínimo 10 caracteres).",
      messageError: "Escribe un mensaje de al menos 10 caracteres.",
      submitIdle: "Enviar mensaje",
      submitPending: "Enviando...",
      honeypotLabel: "No completar",
    },
  },
};

export const portfolioDataEn: PortfolioData = {
  brandName: "DAVID ALEXIS",
  brandBadge: "Full-Stack & AI",
  footerLabel: "PORTFOLIO 2026",
  siteUrl: SITE_URL,
  navItems: [
    {
      id: "proyectos",
      label: "Projects",
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
      label: "Contact",
      href: "#contacto",
    },
  ],
  hero: {
    avatarSrc: "/images/profile-david.jpg",
    avatarAlt: "Portrait of David Alexis, Full-Stack & AI Engineer",
    titleLead: "Full-",
    titleAccent: "Stack",
    titleTail: " & AI Engineer",
    subtitle:
      "Computer Systems Engineer. Building modern web tools, system optimization engines, and applied AI solutions.",
    secondaryCta: {
      label: "View Projects",
      href: "#proyectos",
    },
    primaryCta: {
      label: "Contact",
      href: "#contacto",
    },
  },
  projectsSection: {
    eyebrow: "01 / FEATURED PROJECTS",
    foldNextLabel: "Go to Stack & AI Architecture",
    foldNextHref: "#stack",
    items: [
      {
        id: "optigo-ai",
        title: "OptiGo AI",
        subtitle: "HackMTY 2025 / Infosys Challenge",
        description:
          "AI-powered dispatch and route simulation system for independent delivery drivers.",
        logoSrc: "/images/projects/optigo-logo.svg",
        logoAlt: "Official OptiGo AI logo",
        logoSurface: "dark-blue",
        logoWidth: 300,
        logoHeight: 305,
        stack: ["Django", "Next.js", "OR-Tools", "DeepSeek"],
        role: "Full-Stack & Optimization Engineer",
        year: "2025",
        challenge:
          "Coordinate independent delivery routes under dynamic time windows while reducing deadhead mileage and dispatch wait times.",
        architecture:
          "Combinatorial VRP optimization engine built with Django + Google OR-Tools coupled with DeepSeek to explain dispatch decisions and simulate real-time scenarios from Next.js.",
        highlights: [
          "Multi-stop vehicle routing (VRP) solver with capacity and priority constraints.",
          "DeepSeek analytical assistant to simulate reassignments during demand spikes.",
          "Next.js operational dashboard with live route telemetry and efficiency metrics.",
        ],
        impact:
          "Functional prototype showcased at HackMTY / Infosys Challenge demonstrating simulated reductions in idle dispatch time.",
        repoUrl: "https://github.com/alo-py/Reto-Infosys",
        repoLabel: "View repository on GitHub",
      },
      {
        id: "librerio-app",
        title: "Librerio App",
        description:
          "Social reading platform featuring a conversational assistant and generative AI.",
        logoSrc: "/images/projects/librerio-logo.svg",
        logoAlt: "Official Librerio App logo",
        logoSurface: "dark-purple",
        logoWidth: 1200,
        logoHeight: 900,
        stack: ["Next.js", "Express", "TS", "Supabase"],
        role: "Lead Full-Stack Developer",
        year: "2025",
        challenge:
          "Combine a reading community, habit tracking, and spoiler-free contextual book recommendations powered by generative AI.",
        architecture:
          "SSR/RSC frontend in Next.js with TypeScript, Express REST API for prompt orchestration, and persistence/authentication in Supabase (PostgreSQL + RLS).",
        highlights: [
          "Reading-progress-aware conversational assistant designed to prevent spoilers.",
          "Bookshelf management, reviews, and collaborative lists secured with Supabase RLS policies.",
          "End-to-end typed contracts between the Express backend and Next.js client.",
        ],
        impact:
          "Seamless reading retention and semantic discovery experience tailored to each reader's progress.",
        liveUrl: "https://librerio-app.vercel.app/",
        liveLabel: "Live website",
        repoUrl: "https://github.com/NarcisoDMC/LibrerioApp-Official",
        repoLabel: "GitHub Repository",
      },
      {
        id: "cosmolights",
        title: "CosmoLights",
        description:
          "Open-source desktop hardware controller and USB serial lighting interface.",
        logoSrc: "/images/projects/cosmolight-logo.svg",
        logoAlt: "Official CosmoLights logo",
        logoSurface: "dark-indigo",
        logoWidth: 200,
        logoHeight: 180,
        stack: ["Python", "React", "Serial / USB"],
        role: "Systems & Desktop Interface Engineer",
        year: "2025",
        challenge:
          "Control physical lighting over serial/USB communication with low latency and an accessible modern desktop interface for creators.",
        architecture:
          "Python serial communication daemon bridged locally to a reactive React interface for scenes, color profiles, and live synchronization.",
        highlights: [
          "Automatic Serial/USB port discovery and fault-tolerant reconnection.",
          "Compact frame protocol for flicker-free color transitions.",
          "Modular open-source architecture designed for custom lighting effects.",
        ],
        impact:
          "Direct hardware-software integration replacing closed proprietary utilities with an open, extensible workflow.",
        repoUrl: "https://github.com/NarcisoDMC/CosmoLights",
        repoLabel: "GitHub Repository",
      },
    ],
  },
  stackSection: {
    eyebrow: "02 / STACK & AI ARCHITECTURE",
    title: "Product engineering, optimization, and applied intelligence",
    subtitle:
      "I build end-to-end systems ranging from Core Web Vitals-optimized interfaces to combinatorial optimization engines, LLM pipelines, and hardware control.",
    pillars: [
      {
        id: "frontend-ui",
        indexLabel: "01",
        title: "Frontend & UI Systems",
        focus:
          "High-performance interfaces with Server-First architecture, WCAG accessibility, and modern CSS without heavy runtime bloat.",
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
        title: "Backend & Data",
        focus:
          "Resilient APIs, secure relational data modeling, and decoupled services engineered to scale.",
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
        title: "AI & Optimization",
        focus:
          "Practical integration of generative models alongside classical operations research algorithms.",
        technologies: [
          "DeepSeek",
          "LLMs & Prompts",
          "OR-Tools",
          "RAG Assistants",
          "VRP Simulation",
        ],
      },
      {
        id: "systems-hardware",
        indexLabel: "04",
        title: "Systems & Hardware",
        focus:
          "Low-level connectivity, desktop utilities, workflow automation, and reproducible deployments.",
        technologies: [
          "Serial / USB",
          "Desktop Apps",
          "Linux",
          "Docker",
          "Git & CI/CD",
        ],
      },
    ],
  },
  githubSection: {
    eyebrow: "03 / GITHUB & OPEN SOURCE",
    title: "Open source, architecture, and production deployments",
    subtitle:
      "Explore my active repositories and shipped projects across Full-Stack web architecture, optimization engines, and hardware tooling.",
    handle: "@NarcisoDMC",
    profileUrl: GITHUB_URL,
    profileCtaLabel: "Visit GitHub profile",
    bio: "Computer Systems Engineer focused on fast web applications, optimization models, and AI & hardware integrations.",
    highlights: ["Full-Stack & AI", "VRP Optimization", "Hardware / USB"],
    whenlyBanner: {
      eyebrow: "IN DEVELOPMENT · NEW CONCEPT",
      name: "Whenly App",
      description:
        "Web application to organize tasks, reminders, and notes—purpose-built for non-technical adults who want a friction-free way to keep their small businesses and daily routines in order.",
      features: [
        "Simple tasks & reminders",
        "Business & daily routine notes",
        "Clear, accessible interface",
      ],
      statusLabel: "Coming soon",
      ctaLabel: "Follow progress on GitHub",
      ctaHref: GITHUB_URL,
    },
  },
  contactSection: {
    eyebrow: "04 / CONTACT",
    title: "Let's build reliable, intelligent software",
    contact: {
      heading: "Available for projects and collaborations",
      description:
        "Looking for a Full-Stack & AI engineer to build a web product, optimize operations, or integrate artificial intelligence into production? Reach out directly.",
      availability:
        "Available for Full-Stack / AI roles & technical consulting",
      location: "Mexico · Remote / Hybrid",
      email: CONTACT_EMAIL,
      githubUrl: GITHUB_URL,
      linkedinUrl: LINKEDIN_URL,
      formHeading: "Send me a message",
    },
  },
  ui: {
    pageTitle: "David Alexis | Full-Stack & AI Engineer",
    skipToContent: "Skip to main content",
    primaryNavAriaLabel: "Primary",
    footerNavAriaLabel: "Footer",
    backToTopAriaLabel: "Back to top",
    opensInNewTab: "(opens in a new tab)",
    languageSwitchPrefix: "Language",
    languageSwitchTarget: "enable English",
    projectDialog: {
      closeAriaLabel: "Close project details",
      challengeHeading: "Challenge",
      architectureHeading: "Technical Architecture",
      highlightsHeading: "Key Highlights",
      impactHeading: "Impact",
      techStackHeading: "Tech Stack",
      defaultLiveLabel: "Live website",
      defaultRepoLabel: "View repository on GitHub",
    },
    stackTechnologiesAriaPrefix: "Technologies for",
    githubFocusAreasAriaLabel: "GitHub focus areas",
    whenlyFeaturesAriaLabel: "Key features of Whenly App",
    contact: {
      locationLabel: "Location",
      directEmailLabel: "Direct email",
      copyEmailAriaLabel: "Copy email address",
      copyButtonIdle: "Copy",
      copyButtonCopied: "Copied",
      copyToastCopied: "Copied",
      copyToastFailed: "Could not copy",
      nameLabel: "Name",
      nameHint: "Minimum 2 characters.",
      nameError: "Please enter your name (at least 2 characters).",
      emailLabel: "Email address",
      emailHint: "Format: you@domain.com",
      emailError:
        "Please enter a valid email address (e.g. you@domain.com).",
      messageLabel: "Message",
      messageHint:
        "Tell me about your project, goal, or role (minimum 10 characters).",
      messageError: "Please write a message of at least 10 characters.",
      submitIdle: "Send message",
      submitPending: "Sending...",
      honeypotLabel: "Do not fill",
    },
  },
};

export const portfolioDataByLocale: Record<Locale, PortfolioData> = {
  es: portfolioDataEs,
  en: portfolioDataEn,
};

export const portfolioData: PortfolioData = portfolioDataEs;
