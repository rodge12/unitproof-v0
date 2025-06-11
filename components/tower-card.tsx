"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, MapPin, Users, Eye, Lock, DollarSign } from "lucide-react"
import { UnitModal } from "@/components/unit-modal"
import { useUser } from "@/contexts/user-context"
import { LoginModal } from "@/components/login-modal"
import { ExportModal } from "@/components/export-modal"
import { WhatsAppModal } from "@/components/whatsapp-modal"
import type { Tower } from "@/types"
import Image from 'next/image'
import { LeadModal } from "@/components/lead-modal"

interface TowerCardProps {
  tower: Tower
  onLeadSubmit: (towerId: string, data: any) => void
}

export function TowerCard({ tower, onLeadSubmit }: TowerCardProps) {
  const [showUnits, setShowUnits] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [showLeadModal, setShowLeadModal] = useState(false)
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

  const handleLeadSubmit = (data: any) => {
    onLeadSubmit(tower.id, data)
    setShowLeadModal(false)
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="aspect-video bg-gray-700 rounded-lg mb-3 overflow-hidden">
            <Image
              src={tower.image_url || "/placeholder.svg"}
              alt={tower.name}
              width={400}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <CardTitle className="text-xl font-bold">{tower.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total Units</span>
              <span className="font-medium">{tower.total_units}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Vacant Units</span>
              <span className="font-medium">{tower.vacant_units}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Average Rent</span>
              <span className="font-medium">AED {tower.average_rent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Status</span>
              <Badge variant={tower.vacant_units > 0 ? "default" : "secondary"}>
                {tower.vacant_units > 0 ? "Available" : "Fully Occupied"}
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setShowLeadModal(true)}
          >
            Contact Agent
          </Button>
          <Button 
            className="flex-1"
            onClick={() => setShowWhatsApp(true)}
          >
            WhatsApp
          </Button>
        </CardFooter>
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

      <LeadModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        onSubmit={handleLeadSubmit}
        towerName={tower.name}
      />
    </>
  )
}
