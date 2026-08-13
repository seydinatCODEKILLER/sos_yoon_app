import { Hero } from "./Hero";
import { TrustBanner } from "./TrustBanner";
import { ProblemSection } from "./ProblemSection";
import { HowItWorks } from "./HowItWorks";
import { LegalDomainsGrid } from "./LegalDomainsGrid";
import { AppShowcase } from "./AppShowcase";
import { AudienceSection } from "./AudienceSection";
import { TrustSecurity } from "./TrustSecurity";
import { FinalCta } from "./FinalCta";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustBanner />
      <ProblemSection />
      <HowItWorks />
      <LegalDomainsGrid />
      <AppShowcase />
      <AudienceSection />
      <TrustSecurity />
      <FinalCta />
      <Footer />
    </main>
  );
}
