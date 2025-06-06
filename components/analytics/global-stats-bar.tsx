"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building, Users, DollarSign, TrendingDown, BarChart3 } from "lucide-react"
import type { GlobalStats } from "@/types"

interface GlobalStatsBarProps {
  stats: GlobalStats
  isLoading?: boolean
}

export function GlobalStatsBar({ stats, isLoading }: GlobalStatsBarProps) {
  if (isLoading) {
    return (
      <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700 mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="w-8 h-8 bg-gray-700 rounded-full mx-auto mb-2" />
                <div className="h-6 bg-gray-700 rounded mb-1" />
                <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`
    }
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M AED`
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K AED`
    }
    return `${amount} AED`
  }

  return (
    <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700 mb-6 shadow-lg">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          {/* Total Towers */}
          <div className="group hover:scale-105 transition-transform duration-200">
            <div className="flex justify-center mb-2">
              <Building className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalTowers}</div>
            <div className="text-sm text-gray-400">Total Towers</div>
          </div>

          {/* Total Vacant Units */}
          <div className="group hover:scale-105 transition-transform duration-200">
            <div className="flex justify-center mb-2">
              <Users className="w-8 h-8 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-white">{formatNumber(stats.totalVacantUnits)}</div>
            <div className="text-sm text-gray-400">Vacant Units</div>
          </div>

          {/* Average Rent */}
          <div className="group hover:scale-105 transition-transform duration-200">
            <div className="flex justify-center mb-2">
              <DollarSign className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-white">{formatNumber(stats.averageRent)}</div>
            <div className="text-sm text-gray-400">Avg. Rent (AED)</div>
          </div>

          {/* Total Rent Loss */}
          <div className="group hover:scale-105 transition-transform duration-200">
            <div className="flex justify-center mb-2">
              <TrendingDown className="w-8 h-8 text-red-400 group-hover:text-red-300 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-white">{formatCurrency(stats.totalRentLoss)}</div>
            <div className="text-sm text-gray-400">Total Rent Loss</div>
          </div>

          {/* Occupancy Rate */}
          <div className="group hover:scale-105 transition-transform duration-200">
            <div className="flex justify-center mb-2">
              <BarChart3 className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.occupancyRate}%</div>
            <div className="text-sm text-gray-400">Occupancy Rate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
