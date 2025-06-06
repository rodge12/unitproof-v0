import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { TowerGrid } from "@/components/towers/tower-grid"
import { ReviewsSection } from "@/components/reviews-section"
import { LeadForm } from "@/components/forms/lead-form"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <HeroSection />

      {/* Tower Grid Section */}
      <section id="towers-section">
        <TowerGrid />
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Lead Generation Section */}
      <section id="lead-form-section" className="py-20 px-4 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Your Free Vacancy Report</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Access detailed vacancy data, rental insights, and market opportunities. Our comprehensive reports help
              you make informed real estate decisions and close more deals.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <LeadForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
