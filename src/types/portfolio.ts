export type ProjectLogoSurface = "dark-blue" | "dark-purple" | "dark-indigo";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  hasIndicatorDot?: boolean;
}

export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroData {
  avatarSrc: string;
  avatarAlt: string;
  titleLead: string;
  titleAccent: string;
  titleTail: string;
  subtitle: string;
  secondaryCta: HeroCta;
  primaryCta: HeroCta;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  logoSrc: string;
  logoAlt: string;
  logoSurface: ProjectLogoSurface;
  logoWidth: number;
  logoHeight: number;
  stack: string[];
  role: string;
  year: string;
  challenge: string;
  architecture: string;
  highlights: string[];
  impact: string;
  repoUrl?: string;
  repoLabel?: string;
  liveUrl?: string;
  liveLabel?: string;
}

export interface StackPillar {
  id: string;
  indexLabel: string;
  title: string;
  focus: string;
  technologies: string[];
}

export interface WhenlyBannerData {
  eyebrow: string;
  name: string;
  description: string;
  features: string[];
  statusLabel: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface ContactData {
  heading: string;
  description: string;
  availability: string;
  location: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  formHeading: string;
}

export interface PortfolioData {
  brandName: string;
  brandBadge: string;
  footerLabel: string;
  siteUrl: string;
  navItems: NavItem[];
  hero: HeroData;
  projectsSection: {
    eyebrow: string;
    foldNextLabel: string;
    foldNextHref: string;
    items: ProjectItem[];
  };
  stackSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    pillars: StackPillar[];
  };
  githubSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    handle: string;
    profileUrl: string;
    profileCtaLabel: string;
    bio: string;
    highlights: string[];
    whenlyBanner: WhenlyBannerData;
  };
  contactSection: {
    eyebrow: string;
    title: string;
    contact: ContactData;
  };
}
