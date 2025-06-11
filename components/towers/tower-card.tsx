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
import Link from 'next/link'

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

  // Calculate tower statistics
  const vacantUnits = tower.units.filter((unit) => unit.status === "Vacant")
  const becomingVacantUnits = tower.units.filter((unit) => unit.status === "Becoming Vacant in 30 Days")
  const longVacantUnits = tower.units.filter(
    (unit) => unit.status === "Vacant" && unit.daysVacant && unit.daysVacant > 150,
  )
  const occupiedUnits = tower.units.filter((unit) => unit.status === "Rented")

  // Calculate financial metrics
  const rentPrices = tower.units.filter((unit) => unit.rentPrice).map((unit) => unit.rentPrice as number)
  const averageRent = tower.average_rent || (rentPrices.length > 0 ? Math.round(rentPrices.reduce((sum, price) => sum + price, 0) / rentPrices.length) : 0)
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
      const response = await fetch(`/api/towers/${tower.slug}`)
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
    <Link 
      href={`/tower/${tower.slug}`}
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{tower.name}</h2>
      <p className="text-gray-600 mb-4">{tower.area}</p>
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Total Units</p>
          <p className="font-medium">{tower.total_units}</p>
        </div>
        <div>
          <p className="text-gray-500">Vacant Units</p>
          <p className="font-medium text-green-600">{tower.vacant_units}</p>
        </div>
        <div>
          <p className="text-gray-500">Avg. Rent</p>
          <p className="font-medium">AED {tower.average_rent.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  )
}
