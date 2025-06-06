"use client"

import { Mail, Phone, MapPin, MessageSquare } from "lucide-react"

export function Footer() {
  const handleEmailClick = () => {
    window.open(
      "mailto:unitproof@outlook.com?subject=Inquiry about UnitProof&body=Hi, I would like to learn more about UnitProof.",
      "_blank",
    )
  }

  const handlePhoneClick = () => {
    window.open("tel:+971581965830", "_blank")
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi, I would like to learn more about UnitProof and your vacancy reports.")
    window.open(`https://wa.me/971581965830?text=${message}`, "_blank")
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToTowers = () => {
    const towersSection = document.getElementById("towers-section")
    if (towersSection) {
      towersSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4 cursor-pointer" onClick={scrollToTop}>
              <div className="w-8 h-8 rounded border-2 border-cyan-400 flex items-center justify-center">
                <span className="text-cyan-400 font-bold text-lg">U</span>
              </div>
              <span className="text-white font-bold text-xl">UnitProof</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Dubai's premier real estate analytics platform. Get comprehensive insights into vacancy rates, rental
              trends, and market opportunities across all major developments.
            </p>
            <div className="flex space-x-4">
              <div
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors cursor-pointer group"
                onClick={handleEmailClick}
              >
                <Mail className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <div
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer group"
                onClick={handlePhoneClick}
              >
                <Phone className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <div
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer group"
                onClick={handleWhatsAppClick}
              >
                <MessageSquare className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={scrollToTowers} className="hover:text-cyan-400 transition-colors text-left">
                  All Towers
                </button>
              </li>
              <li>
                <button onClick={scrollToTowers} className="hover:text-cyan-400 transition-colors text-left">
                  Dubai Marina
                </button>
              </li>
              <li>
                <button onClick={scrollToTowers} className="hover:text-cyan-400 transition-colors text-left">
                  Downtown Dubai
                </button>
              </li>
              <li>
                <button onClick={scrollToTowers} className="hover:text-cyan-400 transition-colors text-left">
                  JBR
                </button>
              </li>
              <li>
                <button onClick={scrollToTowers} className="hover:text-cyan-400 transition-colors text-left">
                  Business Bay
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Dubai, United Arab Emirates</span>
              </div>
              <div
                className="flex items-center cursor-pointer hover:text-cyan-400 transition-colors"
                onClick={handleEmailClick}
              >
                <Mail className="w-5 h-5 mr-2 text-cyan-400 flex-shrink-0" />
                <span className="text-sm">unitproof@outlook.com</span>
              </div>
              <div
                className="flex items-center cursor-pointer hover:text-green-400 transition-colors"
                onClick={handlePhoneClick}
              >
                <Phone className="w-5 h-5 mr-2 text-green-400 flex-shrink-0" />
                <span className="text-sm">+971 58 196 5830</span>
              </div>
              <div
                className="flex items-center cursor-pointer hover:text-green-400 transition-colors"
                onClick={handleWhatsAppClick}
              >
                <MessageSquare className="w-5 h-5 mr-2 text-green-400 flex-shrink-0" />
                <span className="text-sm">WhatsApp Support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 UnitProof. All rights reserved. | Real Estate Analytics Platform</p>
        </div>
      </div>
    </footer>
  )
}
