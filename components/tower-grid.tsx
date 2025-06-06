"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TowerCard } from "@/components/tower-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter, X } from "lucide-react"
import type { Tower } from "@/lib/sample-data"
import { useUser } from "@/contexts/user-context"
import { useToast } from "@/components/ui/use-toast"

export function TowerGrid() {
  const [towers, setTowers] = useState<Tower[]>([])
  const [filteredTowers, setFilteredTowers] = useState<Tower[]>([])
  const [visibleCount, setVisibleCount] = useState(12)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedArea, setSelectedArea] = useState("all")
  const [unitType, setUnitType] = useState("")
  const [vacancyStatus, setVacancyStatus] = useState("")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 })
  const [showFilters, setShowFilters] = useState(false)

  const { isAuthenticated, userRole } = useUser()
  const { toast } = useToast()

  // Fetch towers data
  useEffect(() => {
    const fetchTowers = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/towers?area=${selectedArea}&search=${searchQuery}`)
        if (!response.ok) throw new Error("Failed to fetch towers")
        const data = await response.json()
        setTowers(data)
        setFilteredTowers(data)
      } catch (error) {
        console.error("Error fetching towers:", error)
        toast({
          title: "Error",
          description: "Failed to load tower data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTowers()
  }, [selectedArea, searchQuery, toast])

  // Apply filters
  useEffect(() => {
    // Filter towers based on unit type and vacancy status
    if (!unitType && !vacancyStatus && priceRange.min === 0 && priceRange.max === 1000000) {
      setFilteredTowers(towers)
      return
    }

    const filtered = towers.filter((tower) => {
      // Check if tower has units matching the filters
      return tower.units.some((unit) => {
        const matchesType = !unitType || unit.type.toLowerCase().includes(unitType.toLowerCase())
        const matchesPrice = !unit.rentPrice || (unit.rentPrice >= priceRange.min && unit.rentPrice <= priceRange.max)

        let matchesVacancy = true
        if (vacancyStatus === "vacant") {
          matchesVacancy = unit.status === "vacant"
        } else if (vacancyStatus === "occupied") {
          matchesVacancy = unit.status === "occupied"
        } else if (vacancyStatus === "long-vacant") {
          matchesVacancy = unit.status === "vacant" && unit.daysVacant && unit.daysVacant > 150
        }

        return matchesType && matchesPrice && matchesVacancy
      })
    })

    setFilteredTowers(filtered)
  }, [towers, unitType, vacancyStatus, priceRange])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is handled by the useEffect that depends on searchQuery
  }

  const resetFilters = () => {
    setUnitType("")
    setVacancyStatus("")
    setPriceRange({ min: 0, max: 1000000 })
    setShowFilters(false)
  }

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 12, filteredTowers.length))
  }

  const visibleTowers = filteredTowers.slice(0, visibleCount)

  return (
    <section className="py-16 px-4 bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Dubai Residential Towers</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore comprehensive data on Dubai's premier residential developments. Click on any tower to view detailed
            unit information and vacancy analytics.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search towers by name or area..."
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select Area" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-white">
                  All Areas
                </SelectItem>
                <SelectItem value="marina" className="text-white">
                  Dubai Marina
                </SelectItem>
                <SelectItem value="downtown" className="text-white">
                  Downtown Dubai
                </SelectItem>
                <SelectItem value="jbr" className="text-white">
                  JBR
                </SelectItem>
                <SelectItem value="business bay" className="text-white">
                  Business Bay
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              className="border-gray-700 text-gray-400 hover:text-white hover:border-cyan-400"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </form>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4 animate-in fade-in-50 slide-in-from-top-5 duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">Advanced Filters</h3>
                <Button variant="ghost" size="sm" onClick={resetFilters} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4 mr-1" /> Reset
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Unit Type</label>
                  <Select value={unitType} onValueChange={setUnitType}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Any Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="" className="text-white">
                        Any Type
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
                      <SelectItem value="penthouse" className="text-white">
                        Penthouse
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Vacancy Status</label>
                  <Select value={vacancyStatus} onValueChange={setVacancyStatus}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Any Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="" className="text-white">
                        Any Status
                      </SelectItem>
                      <SelectItem value="vacant" className="text-white">
                        Vacant
                      </SelectItem>
                      <SelectItem value="occupied" className="text-white">
                        Occupied
                      </SelectItem>
                      <SelectItem value="long-vacant" className="text-white">
                        Long Vacant (150+ days)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Price Range (AED/year)</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <span className="text-gray-400">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tower Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4 h-[350px]">
                <Skeleton className="h-40 w-full bg-gray-700 mb-4" />
                <Skeleton className="h-6 w-3/4 bg-gray-700 mb-2" />
                <Skeleton className="h-4 w-1/2 bg-gray-700 mb-4" />
                <Skeleton className="h-4 w-full bg-gray-700 mb-2" />
                <Skeleton className="h-4 w-2/3 bg-gray-700 mb-4" />
                <Skeleton className="h-10 w-full bg-gray-700" />
              </div>
            ))}
          </div>
        ) : filteredTowers.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-2">No towers found</h3>
            <p className="text-gray-400">Try adjusting your search or filters to see more results.</p>
            <Button
              onClick={resetFilters}
              variant="outline"
              className="mt-4 border-gray-600 text-white hover:bg-gray-700"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {visibleTowers.map((tower) => (
                <TowerCard key={tower.id} tower={tower} />
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredTowers.length && (
              <div className="text-center">
                <Button onClick={loadMore} variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  Load More Towers
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
