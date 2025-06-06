"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar, Clock, DollarSign, Search, MessageSquare, Filter, Bed } from "lucide-react"
import { useUser } from "@/contexts/user-context"

interface Unit {
  id: string
  unit_number: string
  bedrooms: number | null
  rent_price: number | null
  contract_end: string | null
  days_vacant: number | null
  status: "Vacant" | "Occupied" | "Long Vacant"
}

interface Tower {
  id: string
  name: string
  area: string
  total_units: number
  units: Unit[]
}

interface UnitModalProps {
  tower: Tower
  isOpen: boolean
  onClose: () => void
  onRequestList: () => void
}

export function UnitModal({ tower, isOpen, onClose, onRequestList }: UnitModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [bedroomFilter, setBedroomFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [sortBy, setSortBy] = useState("unit")

  const { user } = useUser()

  // Filter and sort units
  const filteredAndSortedUnits = useMemo(() => {
    const filtered = tower.units.filter((unit) => {
      const matchesSearch =
        !searchQuery ||
        unit.unit_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (unit.bedrooms && unit.bedrooms.toString().includes(searchQuery))

      const matchesBedrooms = !bedroomFilter || (unit.bedrooms && unit.bedrooms.toString() === bedroomFilter)

      const matchesStatus = !statusFilter || unit.status === statusFilter

      return matchesSearch && matchesBedrooms && matchesStatus
    })

    // Sort units
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "unit":
          return a.unit_number.localeCompare(b.unit_number)
        case "price-asc":
          return (a.rent_price || 0) - (b.rent_price || 0)
        case "price-desc":
          return (b.rent_price || 0) - (a.rent_price || 0)
        case "vacancy":
          if (a.status === "Vacant" && b.status !== "Vacant") return -1
          if (a.status !== "Vacant" && b.status === "Vacant") return 1
          return (b.days_vacant || 0) - (a.days_vacant || 0)
        case "bedrooms":
          return (a.bedrooms || 0) - (b.bedrooms || 0)
        default:
          return 0
      }
    })
  }, [tower.units, searchQuery, bedroomFilter, statusFilter, sortBy])

  // Calculate statistics
  const stats = useMemo(() => {
    const vacant = tower.units.filter((u) => u.status === "Vacant" || u.status === "Long Vacant")
    const longVacant = tower.units.filter((u) => u.status === "Long Vacant")
    const occupied = tower.units.filter((u) => u.status === "Occupied")
    const occupancyRate = Math.round((occupied.length / tower.units.length) * 100)

    return {
      vacant: vacant.length,
      longVacant: longVacant.length,
      occupied: occupied.length,
      occupancyRate,
    }
  }, [tower.units])

  const getStatusBadge = (unit: Unit) => {
    switch (unit.status) {
      case "Occupied":
        return <Badge className="bg-green-900 text-green-300 border-green-600">Occupied</Badge>
      case "Long Vacant":
        return <Badge className="bg-red-900 text-red-300 border-red-600 animate-pulse">Long Vacant</Badge>
      case "Vacant":
        return <Badge className="bg-yellow-900 text-yellow-300 border-yellow-600">Vacant</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const UnitCard = ({ unit }: { unit: Unit }) => (
    <Card className="bg-gray-800 border-gray-700 hover:border-cyan-400 transition-all duration-300 group">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
              Unit {unit.unit_number}
            </h4>
            {unit.bedrooms && (
              <div className="flex items-center text-gray-400 text-sm mt-1">
                <Bed className="w-4 h-4 mr-1" />
                {unit.bedrooms} Bedroom{unit.bedrooms !== 1 ? "s" : ""}
              </div>
            )}
          </div>
          {getStatusBadge(unit)}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-300">
            <DollarSign className="w-4 h-4 mr-2 text-green-400" />
            <span className="font-medium">AED {unit.rent_price?.toLocaleString() || "N/A"}/year</span>
          </div>

          {unit.contract_end && (
            <div className="flex items-center text-gray-300">
              <Calendar className="w-4 h-4 mr-2 text-cyan-400" />
              <span>Contract ended: {new Date(unit.contract_end).toLocaleDateString()}</span>
            </div>
          )}

          {unit.days_vacant && (
            <div className="flex items-center text-gray-300">
              <Clock className={`w-4 h-4 mr-2 ${unit.days_vacant > 150 ? "text-red-400" : "text-yellow-400"}`} />
              <span className={unit.days_vacant > 150 ? "text-red-300 font-medium" : ""}>
                Vacant for {unit.days_vacant} days
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-cyan-400" />
            {tower.name} - Unit Details
          </DialogTitle>
          <p className="text-gray-400">
            {tower.area} • {tower.total_units} Total Units
          </p>
        </DialogHeader>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search units..."
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>

          <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="" className="text-white">
                All Bedrooms
              </SelectItem>
              <SelectItem value="0" className="text-white">
                Studio
              </SelectItem>
              <SelectItem value="1" className="text-white">
                1 Bedroom
              </SelectItem>
              <SelectItem value="2" className="text-white">
                2 Bedrooms
              </SelectItem>
              <SelectItem value="3" className="text-white">
                3 Bedrooms
              </SelectItem>
              <SelectItem value="4" className="text-white">
                4+ Bedrooms
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="" className="text-white">
                All Status
              </SelectItem>
              <SelectItem value="Vacant" className="text-white">
                Vacant
              </SelectItem>
              <SelectItem value="Occupied" className="text-white">
                Occupied
              </SelectItem>
              <SelectItem value="Long Vacant" className="text-white">
                Long Vacant
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="unit" className="text-white">
                Unit Number
              </SelectItem>
              <SelectItem value="bedrooms" className="text-white">
                Bedrooms
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

          <div className="flex gap-2">
            <Button
              onClick={onRequestList}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-green-600 hover:from-cyan-700 hover:to-green-700 text-white"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Request List
            </Button>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-4 gap-4 bg-gray-800 p-4 rounded-lg mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">{stats.vacant}</p>
            <p className="text-xs text-gray-400">Vacant Units</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">{stats.longVacant}</p>
            <p className="text-xs text-gray-400">Long Vacant</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{stats.occupied}</p>
            <p className="text-xs text-gray-400">Occupied</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">{stats.occupancyRate}%</p>
            <p className="text-xs text-gray-400">Occupancy Rate</p>
          </div>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedUnits.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No units match your filters</p>
              <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
            </div>
          ) : (
            filteredAndSortedUnits.map((unit) => <UnitCard key={unit.id} unit={unit} />)
          )}
        </div>

        {/* Results Summary */}
        {filteredAndSortedUnits.length > 0 && (
          <div className="text-center text-gray-400 text-sm mt-4">
            Showing {filteredAndSortedUnits.length} of {tower.units.length} units
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
