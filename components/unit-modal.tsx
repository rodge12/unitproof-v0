"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar, Clock, DollarSign, Search, Download, MessageSquare } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import type { Tower, Unit } from "@/lib/sample-data"

interface UnitModalProps {
  tower: Tower
  isOpen: boolean
  onClose: () => void
  onRequestList: () => void
}

export function UnitModal({ tower, isOpen, onClose, onRequestList }: UnitModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [unitType, setUnitType] = useState("")
  const [vacancyStatus, setVacancyStatus] = useState("")
  const [sortBy, setSortBy] = useState("unit")

  const { userRole } = useUser()

  // Filter and sort units
  const filteredUnits = tower.units.filter((unit) => {
    const matchesSearch =
      !searchQuery ||
      unit.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = !unitType || unit.type.toLowerCase().includes(unitType.toLowerCase())

    let matchesVacancy = true
    if (vacancyStatus === "vacant") {
      matchesVacancy = unit.status === "vacant"
    } else if (vacancyStatus === "occupied") {
      matchesVacancy = unit.status === "occupied"
    } else if (vacancyStatus === "long-vacant") {
      matchesVacancy = unit.status === "vacant" && unit.daysVacant && unit.daysVacant > 150
    }

    return matchesSearch && matchesType && matchesVacancy
  })

  // Sort units
  const sortedUnits = [...filteredUnits].sort((a, b) => {
    if (sortBy === "unit") {
      return a.number.localeCompare(b.number)
    } else if (sortBy === "price-asc") {
      return (a.rentPrice || 0) - (b.rentPrice || 0)
    } else if (sortBy === "price-desc") {
      return (b.rentPrice || 0) - (a.rentPrice || 0)
    } else if (sortBy === "vacancy") {
      if (a.status === "vacant" && b.status !== "vacant") return -1
      if (a.status !== "vacant" && b.status === "vacant") return 1
      return (b.daysVacant || 0) - (a.daysVacant || 0)
    }
    return 0
  })

  const getStatusBadge = (unit: Unit) => {
    if (unit.status === "occupied") {
      return <Badge className="bg-green-900 text-green-300">Occupied</Badge>
    }
    if (unit.daysVacant && unit.daysVacant > 150) {
      return (
        <Badge variant="destructive" className="bg-red-900 text-red-300">
          Vacant (For Sale/Owner Occupied)
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-yellow-900 text-yellow-300">
        Vacant
      </Badge>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-cyan-400" />
            {tower.name} - Unit Details
          </DialogTitle>
          <p className="text-gray-400">
            {tower.area} • {tower.totalUnits} Total Units
          </p>
        </DialogHeader>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search units..."
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>

          <Select value={unitType} onValueChange={setUnitType}>
            <SelectTrigger className="w-full md:w-40 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Unit Type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="" className="text-white">
                All Types
              </SelectItem>
              <SelectItem value="studio" className="text-white">
                Studio
              </SelectItem>
              <SelectItem value="1br" className="text-white">
                1 Bedroom
              </SelectItem>
              <SelectItem value="2br" className="text-white">
                2 Bedrooms
              </SelectItem>
              <SelectItem value="3br" className="text-white">
                3 Bedrooms
              </SelectItem>
              <SelectItem value="4br" className="text-white">
                4+ Bedrooms
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={vacancyStatus} onValueChange={setVacancyStatus}>
            <SelectTrigger className="w-full md:w-40 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="" className="text-white">
                All Status
              </SelectItem>
              <SelectItem value="vacant" className="text-white">
                Vacant
              </SelectItem>
              <SelectItem value="occupied" className="text-white">
                Occupied
              </SelectItem>
              <SelectItem value="long-vacant" className="text-white">
                Long Vacant
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-40 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="unit" className="text-white">
                Unit Number
              </SelectItem>
              <SelectItem value="price-asc" className="text-white">
                Price (Low-High)
              </SelectItem>
              <SelectItem value="price-desc" className="text-white">
                Price (High-Low)
              </SelectItem>
              <SelectItem value="vacancy" className="text-white">
                Vacancy Duration
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-2 bg-gray-800 p-3 rounded-lg mb-4 text-center">
          <div>
            <p className="text-xs text-gray-400">Vacant Units</p>
            <p className="text-lg font-semibold text-cyan-400">
              {tower.units.filter((u) => u.status === "vacant").length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Long Vacant</p>
            <p className="text-lg font-semibold text-red-400">
              {tower.units.filter((u) => u.status === "vacant" && u.daysVacant && u.daysVacant > 150).length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Occupancy Rate</p>
            <p className="text-lg font-semibold text-green-400">
              {Math.round((tower.units.filter((u) => u.status === "occupied").length / tower.units.length) * 100)}%
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            onClick={onRequestList}
            className="bg-gradient-to-r from-cyan-600 to-green-600 hover:from-cyan-700 hover:to-green-700 text-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Request Full List
          </Button>

          {userRole === "paid" && (
            <Button
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700"
              onClick={() => {
                // Export functionality will be handled in the ExportModal
                onClose()
                // We'll trigger the export modal from the parent component
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          )}
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedUnits.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-400">No units match your filters.</p>
            </div>
          ) : (
            sortedUnits.map((unit) => (
              <Card key={unit.id} className="bg-gray-800 border-gray-700 hover:border-cyan-400 transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-white font-semibold">Unit {unit.number}</h4>
                      <p className="text-gray-400 text-sm">{unit.type}</p>
                    </div>
                    {getStatusBadge(unit)}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-300">
                      <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                      AED {unit.rentPrice?.toLocaleString() || "N/A"}/year
                    </div>

                    {unit.contractEndDate && (
                      <div className="flex items-center text-gray-300">
                        <Calendar className="w-4 h-4 mr-2 text-cyan-400" />
                        Contract ended: {unit.contractEndDate}
                      </div>
                    )}

                    {unit.daysVacant && (
                      <div className="flex items-center text-gray-300">
                        <Clock className="w-4 h-4 mr-2 text-yellow-400" />
                        Vacant for {unit.daysVacant} days
                      </div>
                    )}

                    {unit.notes && (
                      <div className="text-gray-400 text-xs mt-2 p-2 bg-gray-700 rounded">{unit.notes}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
