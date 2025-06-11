"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, MapPin, Users, Eye, Lock, DollarSign, Loader2, Star } from "lucide-react"
import { UnitModal } from "@/components/modals/unit-modal"
import { LoginModal } from "@/components/modals/login-modal"
import { WhatsAppModal } from "@/components/modals/whatsapp-modal"
import { useUser } from "@/contexts/user-context"
import type { Tower } from "@/types"

type TowerCardProps = {
  tower: Tower;
  isPreview?: boolean;
  isFeatured?: boolean;
};

export function TowerCard({ tower, isPreview = false, isFeatured = false }: TowerCardProps) {
  const [showUnits, setShowUnits] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [towerData, setTowerData] = useState<Tower | null>(null)

  const { user, profile, isLoading: authLoading } = useUser()

  // Calculate tower statistics - always show these
  const vacantUnits = tower.units.filter((unit) => unit.status === "vacant")
  const longVacantUnits = tower.units.filter(
    (unit) => unit.status === "vacant" && unit.daysVacant && unit.daysVacant > 150,
  )
  const occupiedUnits = tower.units.filter((unit) => unit.status === "occupied")

  // Calculate financial metrics - always show these
  const rentPrices = tower.units.filter((unit) => unit.rentPrice).map((unit) => unit.rentPrice as number)
  const averageRent =
    rentPrices.length > 0 ? Math.round(rentPrices.reduce((sum, price) => sum + price, 0) / rentPrices.length) : 0
  const totalRentLoss = vacantUnits.reduce((total, unit) => total + (unit.rentPrice || averageRent), 0)

  // Determine access level
  const hasAccess = user && (profile?.role === "premium" || profile?.role === "admin")
  const isLocked = !hasAccess && !isPreview

  const handleViewUnits = async () => {
    // Check access permissions
    if (!user) {
      setShowLogin(true)
      return
    }

    if (!hasAccess) {
      setShowLogin(true)
      return
    }

    setIsLoading(true)
    try {
      // Fetch detailed tower data
      const response = await fetch(`/api/towers/${tower.id}`)
      if (!response.ok) throw new Error("Failed to fetch tower data")

      const data = await response.json()
      setTowerData(data)
      setShowUnits(true)
    } catch (error) {
      console.error("Error loading tower data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestList = () => {
    setShowWhatsApp(true)
  }

  return (
    <>
      <Card className={`group relative overflow-hidden transition-all duration-300 ${
        isFeatured 
          ? 'bg-gradient-to-r from-blue-900 to-indigo-900 border-blue-700' 
          : 'bg-gray-800 border-gray-700'
      }`}>
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Tower Statistics Bar - Always Visible */}
        <div className="bg-gray-900/90 p-3 border-b border-gray-700">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="group/stat hover:scale-105 transition-transform">
              <p className="text-xs text-gray-400">Vacant</p>
              <p className="text-lg font-bold text-yellow-400 group-hover/stat:text-yellow-300 transition-colors">
                {vacantUnits.length}
              </p>
            </div>
            <div className="group/stat hover:scale-105 transition-transform">
              <p className="text-xs text-gray-400">Avg. Rent</p>
              <p className="text-lg font-bold text-green-400 group-hover/stat:text-green-300 transition-colors">
                {averageRent > 0 ? `${(averageRent / 1000).toFixed(0)}K` : "N/A"}
              </p>
            </div>
            <div className="group/stat hover:scale-105 transition-transform">
              <p className="text-xs text-gray-400">Loss</p>
              <p className="text-lg font-bold text-red-400 group-hover/stat:text-red-300 transition-colors">
                {totalRentLoss > 0 ? `${(totalRentLoss / 1000000).toFixed(1)}M` : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <CardHeader className="pb-3 relative">
          <div className="aspect-video bg-gray-700 rounded-lg mb-3 overflow-hidden">
            <img
              src="/placeholder.svg?height=200&width=300"
              alt={tower.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <h3 className={`text-lg font-semibold group-hover:text-cyan-400 transition-colors duration-300 ${
            isFeatured ? 'text-white' : 'text-white'
          }`}>
            {tower.name}
            {isFeatured && (
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded-full">
                Featured
              </span>
            )}
          </h3>
          <div className="flex items-center text-gray-400 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {tower.area}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative">
          {/* Tower Summary - Always Visible */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-300">
              <Building className="w-4 h-4 mr-1" />
              {tower.totalUnits} Units
            </div>
            <div className="flex items-center text-gray-300">
              <Users className="w-4 h-4 mr-1" />
              {occupiedUnits.length} Occupied
            </div>
          </div>

          {/* Detailed Stats - Always Visible */}
          <div className="bg-gray-900/50 p-3 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Vacant Units:</span>
              <span className="text-yellow-400 font-semibold">{vacantUnits.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Long Vacant:</span>
              <span className="text-red-400 font-semibold">{longVacantUnits.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Occupied:</span>
              <span className="text-green-400 font-semibold">{occupiedUnits.length}</span>
            </div>
            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Avg. Rent:</span>
                <span className="text-green-400 font-semibold">
                  {averageRent > 0 ? `${(averageRent / 1000).toFixed(0)}K AED` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Est. Rent Loss:</span>
                <span className="text-red-400 font-semibold">
                  {totalRentLoss > 0 ? `${(totalRentLoss / 1000000).toFixed(1)}M AED` : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badges - Always Visible */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="bg-yellow-900/50 text-yellow-300 border border-yellow-600 hover:bg-yellow-900 transition-colors"
            >
              {vacantUnits.length} Vacant
            </Badge>
            {longVacantUnits.length > 0 && (
              <Badge
                variant="destructive"
                className="bg-red-900/50 text-red-300 border border-red-600 hover:bg-red-900 transition-colors animate-pulse"
              >
                {longVacantUnits.length} Long Vacant
              </Badge>
            )}
            <Badge className="bg-green-900/50 text-green-300 border border-green-600">
              {Math.round((occupiedUnits.length / tower.totalUnits) * 100)}% Occupied
            </Badge>
          </div>

          {/* Lock Overlay for Unit Details */}
          {isLocked && (
            <div className="relative">
              <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 rounded-lg border border-gray-700">
                <Lock className="w-8 h-8 text-cyan-400 mb-3 animate-pulse" />
                <h4 className="text-white text-lg font-semibold text-center mb-2">🔒 Sign In Required</h4>
                <p className="text-gray-300 text-sm text-center mb-4">
                  View detailed unit information, contact details, and export data
                </p>
                <div className="flex items-center text-yellow-400 text-sm mb-3">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  <span>Premium Feature</span>
                </div>
                <Button
                  onClick={() => setShowLogin(true)}
                  className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white transform hover:scale-105 transition-transform"
                >
                  Unlock Details
                </Button>
              </div>
              {/* Blurred content behind overlay */}
              <div className="blur-sm opacity-50 p-4 bg-gray-800 rounded-lg">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                  <div className="h-8 bg-gray-700 rounded w-full mt-4"></div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons - Always Visible */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              onClick={handleViewUnits}
              disabled={isLoading || authLoading}
              className="bg-gradient-to-r from-cyan-600 to-green-600 hover:from-cyan-700 hover:to-green-700 text-white transform hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Eye className="w-4 h-4 mr-2" />}
              {isLoading ? "Loading..." : isLocked ? "Sign In" : "View Units"}
            </Button>
            <Button
              onClick={handleRequestList}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700 hover:border-cyan-400 transform hover:scale-105 transition-all duration-200"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Request List
            </Button>
          </div>

          {/* Premium Export Button */}
          {hasAccess && (
            <Button
              variant="outline"
              className="w-full border-gray-600 text-white hover:bg-gray-700 hover:border-green-400 transform hover:scale-105 transition-all duration-200"
            >
              Export Data
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {towerData && (
        <UnitModal
          tower={towerData}
          isOpen={showUnits}
          onClose={() => setShowUnits(false)}
          onRequestList={handleRequestList}
        />
      )}

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />

      <WhatsAppModal isOpen={showWhatsApp} onClose={() => setShowWhatsApp(false)} towerName={tower.name} />
    </>
  )
}
