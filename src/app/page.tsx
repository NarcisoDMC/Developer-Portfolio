import { portfolioData } from "@/data/portfolio";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { StackSection } from "@/components/sections/StackSection";
import { GitHubSection } from "@/components/sections/GitHubSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "David Alexis",
    jobTitle: "Full-Stack & AI Engineer",
    description: portfolioData.hero.subtitle,
    url: portfolioData.siteUrl,
    sameAs: [
      portfolioData.contactSection.contact.githubUrl,
      portfolioData.contactSection.contact.linkedinUrl,
    ],
    knowsAbout: portfolioData.stackSection.pillars.flatMap(
      (pillar) => pillar.technologies,
    ),
  };

  return (
    <main>
      <HeroSection />
      <ProjectsSection />
      <StackSection />
      <GitHubSection />
      <ContactSection />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
