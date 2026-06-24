import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { SocialProof } from "@/components/landing/SocialProof";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTABanner } from "@/components/landing/CTABanner";

/**
 * Landing page — FitScoreCV
 *
 * Section order:
 * 1. Navbar (sticky, global)
 * 2. Hero — Headline + ATS Preview Card
 * 3. Social Proof — Company logos bar
 * 4. Features — 4 feature cards
 * 5. How It Works — 3-step flow
 * 6. Testimonials — 3 testimonial cards + stats
 * 7. CTA Banner — Conversion block
 * 8. Footer — Global footer
 */
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <SocialProof />
        <FeaturesSection />
        <HowItWorks />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
