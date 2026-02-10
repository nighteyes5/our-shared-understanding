import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { VisualSection } from "@/components/landing/visual-section"
import { CtaSection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"
import "./landing.css"

export default function Landing() {
  return (
    <main className="landing-dark">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <VisualSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
