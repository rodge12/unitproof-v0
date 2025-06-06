"use client"

import { Button } from "@/components/ui/button"
import { TrendingUp, Building, Users, MapPin } from "lucide-react"

export function HeroSection() {
  const scrollToTowers = () => {
    const towersSection = document.getElementById("towers-section")
    if (towersSection) {
      towersSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToLeadForm = () => {
    const leadFormSection = document.getElementById("lead-form-section")
    if (leadFormSection) {
      leadFormSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-green-500/10" />
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Dubai Real Estate
            <span className="block bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              Analytics Platform
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Comprehensive insights into Dubai's residential market. Track vacancy rates, rental prices, and market
            trends across all major towers and developments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={scrollToTowers}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-semibold px-8 transform hover:scale-105 transition-all duration-200"
            >
              Explore Towers
            </Button>
            <Button
              onClick={scrollToLeadForm}
              size="lg"
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 transform hover:scale-105 transition-all duration-200"
            >
              Get Free Report
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="flex justify-center mb-2">
                <Building className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </div>
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-gray-400">Towers Tracked</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="flex justify-center mb-2">
                <Users className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors" />
              </div>
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-gray-400">Units Monitored</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="flex justify-center mb-2">
                <MapPin className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </div>
              <div className="text-2xl font-bold text-white">25+</div>
              <div className="text-gray-400">Areas Covered</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="flex justify-center mb-2">
                <TrendingUp className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors" />
              </div>
              <div className="text-2xl font-bold text-white">Real-time</div>
              <div className="text-gray-400">Data Updates</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
