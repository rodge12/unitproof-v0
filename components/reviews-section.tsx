"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const reviews = [
  {
    id: 1,
    name: "Sarah Al-Mansouri",
    title: "Senior Agent at Emirates Properties",
    rating: 5,
    review:
      "I closed two units in one week thanks to UnitProof's vacant list. The data is incredibly accurate and up-to-date. This platform has revolutionized how I find opportunities.",
    avatar: "SA",
  },
  {
    id: 2,
    name: "Ahmed Hassan",
    title: "Property Consultant at DAMAC",
    rating: 5,
    review:
      "UnitProof saved me countless hours of research. The vacancy duration data helps me target the right owners at the right time. My conversion rate has doubled!",
    avatar: "AH",
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    title: "Real Estate Broker at Coldwell Banker",
    rating: 5,
    review:
      "The detailed analytics and owner contact information are game-changers. I've never had access to such comprehensive market data before. Absolutely essential for serious agents.",
    avatar: "MR",
  },
  {
    id: 4,
    name: "Khalid Al-Rashid",
    title: "Investment Advisor at JLL",
    rating: 5,
    review:
      "UnitProof's rent loss calculations help me present compelling cases to property owners. The platform pays for itself with just one successful deal.",
    avatar: "KR",
  },
  {
    id: 5,
    name: "Jennifer Chen",
    title: "Property Manager at Emaar",
    rating: 5,
    review:
      "The long-vacant unit alerts are incredibly valuable. I can proactively reach out to owners before they lose more money. This data is pure gold!",
    avatar: "JC",
  },
  {
    id: 6,
    name: "Omar Farouk",
    title: "Senior Leasing Consultant at Nakheel",
    rating: 5,
    review:
      "Finally, a platform that understands what real estate professionals need. The export features and detailed reports make client presentations so much more professional.",
    avatar: "OF",
  },
]

export function ReviewsSection() {
  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-600"}`} />
      ))}
    </div>
  )

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Real Estate Professionals Are Saying</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of agents, brokers, and property managers who trust UnitProof to find their next opportunity
            and close more deals.
          </p>
          <div className="flex items-center justify-center mt-6 space-x-4">
            <div className="flex items-center">
              <StarRating rating={5} />
              <span className="ml-2 text-yellow-400 font-semibold">5.0</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-300">500+ Reviews</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-300">Trusted by 2,000+ Professionals</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="bg-gray-800 border-gray-700 hover:border-cyan-400 transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-green-500 flex items-center justify-center text-white font-bold">
                    {review.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{review.name}</h4>
                    <p className="text-gray-400 text-sm">{review.title}</p>
                    <div className="mt-2">
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-cyan-400/30" />
                  <p className="text-gray-300 leading-relaxed pl-6">"{review.review}"</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">2,000+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">50K+</div>
              <div className="text-gray-400">Units Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">98%</div>
              <div className="text-gray-400">Data Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
