"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, MapPin, Users, Eye, Lock, DollarSign } from "lucide-react"
import { UnitModal } from "@/components/unit-modal"
import { useUser } from "@/contexts/user-context"
import { LoginModal } from "@/components/login-modal"
import { ExportModal } from "@/components/export-modal"
import { WhatsAppModal } from "@/components/whatsapp-modal"
import type { Tower } from "@/lib/sample-data"

interface TowerCardProps {
  tower: Tower
}

export function TowerCard({ tower }: TowerCardProps) {
  const [showUnits, setShowUnits] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [towerData, setTowerData] = useState<Tower | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { isAuthenticated, userRole } = useUser()

  // Calculate vacancy stats
  const vacantUnits = tower.units.filter((unit) => unit.status === "vacant").length
  const longVacantUnits = tower.units.filter((unit) => unit.daysVacant && unit.daysVacant > 150).length

  // Calculate average rent and total rent loss
  const rentPrices = tower.units.filter((unit) => unit.rentPrice).map((unit) => unit.rentPrice as number)
  const averageRent =
    rentPrices.length > 0 ? Math.round(rentPrices.reduce((sum, price) => sum + price, 0) / rentPrices.length) : 0

  // Estimate rent loss (vacant units * average rent)
  const totalRentLoss = averageRent * vacantUnits

  // Fetch detailed tower data when viewing units
  const fetchTowerData = async () => {
    if (!isAuthenticated && userRole !== "paid") {
      setShowLogin(true)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/towers/${tower.id}`)
      if (!response.ok) throw new Error("Failed to fetch tower data")
      const data = await response.json()
      setTowerData(data)
      setShowUnits(true)
    } catch (error) {
      console.error("Error fetching tower data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewUnits = () => {
    // For free users, only allow viewing one tower
    if (isAuthenticated && userRole === "free") {
      // Check if this is the first tower they're viewing
      const viewedTower = localStorage.getItem("unitproof_viewed_tower")
      if (viewedTower && viewedTower !== tower.id) {
        setShowLogin(true)
        return
      }
      localStorage.setItem("unitproof_viewed_tower", tower.id)
    }

    fetchTowerData()
  }

  const handleRequestList = () => {
    setShowWhatsApp(true)
  }

  const handleExport = () => {
    if (!isAuthenticated || userRole !== "paid") {
      setShowLogin(true)
      return
    }
    setShowExport(true)
  }

  return (
    <>
      <Card className="bg-gray-800 border-gray-700 hover:border-cyan-400 transition-all duration-300 group">
        {/* Vacancy Stats */}
        <div className="bg-gray-900/80 p-3 border-b border-gray-700">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-400">Vacant Units</p>
              <p className="text-lg font-semibold text-cyan-400">{vacantUnits}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Avg. Rent</p>
              <p className="text-lg font-semibold text-green-400">
                {averageRent > 0 ? `${(averageRent / 1000).toFixed(0)}K` : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Rent Loss</p>
              <p className="text-lg font-semibold text-yellow-400">
                {totalRentLoss > 0 ? `${(totalRentLoss / 1000000).toFixed(1)}M` : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <CardHeader className="pb-3 relative">
          {/* Access Control Overlay */}
          {(!isAuthenticated ||
            (userRole === "free" &&
              localStorage.getItem("unitproof_viewed_tower") &&
              localStorage.getItem("unitproof_viewed_tower") !== tower.id)) && (
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 rounded-t-lg">
              <Lock className="w-10 h-10 text-cyan-400 mb-2" />
              <h3 className="text-white text-lg font-semibold text-center mb-1">Premium Content</h3>
              <p className="text-gray-300 text-sm text-center mb-3">
                {isAuthenticated ? "Upgrade to access all towers" : "Sign in to unlock this tower"}
              </p>
              <Button
                onClick={() => setShowLogin(true)}
                className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white"
              >
                {isAuthenticated ? "Upgrade Now" : "Sign In"}
              </Button>
            </div>
          )}

          <div className="aspect-video bg-gray-700 rounded-lg mb-3 overflow-hidden">
            <img
              src="/placeholder.svg?height=200&width=300"
              alt={tower.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">{tower.name}</h3>
          <div className="flex items-center text-gray-400 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {tower.area}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-300">
              <Building className="w-4 h-4 mr-1" />
              {tower.totalUnits} Units
            </div>
            <div className="flex items-center text-gray-300">
              <Users className="w-4 h-4 mr-1" />
              {tower.totalUnits - vacantUnits} Occupied
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
              {vacantUnits} Vacant
            </Badge>
            {longVacantUnits > 0 && (
              <Badge variant="destructive" className="bg-red-900 text-red-300">
                {longVacantUnits} Long Vacant
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              onClick={handleViewUnits}
              disabled={isLoading}
              className="bg-gradient-to-r from-cyan-600 to-green-600 hover:from-cyan-700 hover:to-green-700 text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Units
            </Button>
            <Button
              onClick={handleRequestList}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Request List
            </Button>
          </div>

          {/* Export Button - Only for paid users */}
          {isAuthenticated && userRole === "paid" && (
            <Button
              onClick={handleExport}
              variant="outline"
              className="w-full border-gray-600 text-white hover:bg-gray-700"
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

      <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} tower={tower} />

      <WhatsAppModal isOpen={showWhatsApp} onClose={() => setShowWhatsApp(false)} towerName={tower.name} />
    </>
  )
}
