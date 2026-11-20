import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { portfolioData } from "@/data/portfolio";
import { GlassOrbits } from "@/components/background/GlassOrbits";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ScrollProgressBar } from "@/components/motion/ScrollReveal";
import { SkipLink } from "@/components/layout/SkipLink";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(portfolioData.siteUrl),
  title: {
    default: "David Alexis | Full-Stack & AI Engineer",
    template: "%s | David Alexis",
  },
  description:
    "Portafolio de David Alexis, Ingeniero en Sistemas Computacionales especializado en desarrollo Full-Stack, optimización de sistemas e inteligencia artificial.",
  keywords: [
    "David Alexis",
    "Full-Stack Engineer",
    "AI Engineer",
    "Next.js",
    "TypeScript",
    "Django",
    "Python",
    "OR-Tools",
    "DeepSeek",
  ],
  authors: [{ name: "David Alexis" }],
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/",
    title: "David Alexis | Full-Stack & AI Engineer",
    description:
      "Desarrollo de herramientas web, optimización de sistemas y soluciones de inteligencia artificial.",
    siteName: "David Alexis Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "David Alexis | Full-Stack & AI Engineer",
    description:
      "Desarrollo de herramientas web, optimización de sistemas y soluciones de IA.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <GlassOrbits />
        <MotionProvider>
          <div className="site-content">
            <ScrollProgressBar />
            <SkipLink />
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
