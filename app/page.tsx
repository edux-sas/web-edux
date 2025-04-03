import Hero from "@/components/hero"
import Features from "@/components/features"
import DiscTestPromo from "@/components/disc-test-promo"
import CallToAction from "@/components/call-to-action"
import ExperienceSection from "@/components/experience-section"
import CompanyOverview from "@/components/company-overview"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <DiscTestPromo />
      <ExperienceSection />
      <CompanyOverview />
      <CallToAction />
    </div>
  )
}

