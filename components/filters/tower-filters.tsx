"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X, SlidersHorizontal } from "lucide-react"
import type { FilterOptions } from "@/types"

interface TowerFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onReset: () => void
  isLoading?: boolean
}

export function TowerFilters({ filters, onFiltersChange, onReset, isLoading }: TowerFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)

  // Sync local filters with props
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handlePriceRangeChange = (type: "min" | "max", value: string) => {
    const numValue = value === "" ? (type === "min" ? 0 : 1000000) : Number(value)
    const newPriceRange = { ...localFilters.priceRange, [type]: numValue }
    handleFilterChange("priceRange", newPriceRange)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (localFilters.search) count++
    if (localFilters.area && localFilters.area !== "all") count++
    if (localFilters.unitType) count++
    if (localFilters.vacancyStatus) count++
    if (localFilters.daysVacant) count++
    if (localFilters.priceRange.min > 0 || localFilters.priceRange.max < 1000000) count++
    return count
  }

  const areas = [
    { value: "all", label: "All Areas" },
    { value: "dubai-marina", label: "Dubai Marina" },
    { value: "downtown-dubai", label: "Downtown Dubai" },
    { value: "jbr", label: "JBR" },
    { value: "business-bay", label: "Business Bay" },
    { value: "jvc", label: "JVC" },
    { value: "jvt", label: "JVT" },
    { value: "dubai-hills", label: "Dubai Hills" },
    { value: "dubai-south", label: "Dubai South" },
    { value: "palm-jumeirah", label: "Palm Jumeirah" },
  ]

  const unitTypes = [
    { value: "", label: "All Types" },
    { value: "studio", label: "Studio" },
    { value: "1br", label: "1 Bedroom" },
    { value: "2br", label: "2 Bedrooms" },
    { value: "3br", label: "3 Bedrooms" },
    { value: "4br", label: "4+ Bedrooms" },
    { value: "penthouse", label: "Penthouse" },
  ]

  const vacancyStatuses = [
    { value: "", label: "All Status" },
    { value: "vacant", label: "Vacant" },
    { value: "occupied", label: "Occupied" },
    { value: "long-vacant", label: "Long Vacant (150+ days)" },
  ]

  const daysVacantOptions = [
    { value: "", label: "Any Duration" },
    { value: "30+", label: "30+ days" },
    { value: "60+", label: "60+ days" },
    { value: "90+", label: "90+ days" },
    { value: "150+", label: "150+ days" },
  ]

  return (
    <div className="space-y-4">
      {/* Main Search and Quick Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={localFilters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Search towers by name or area..."
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
                disabled={isLoading}
              />
            </div>

            {/* Area Filter */}
            <Select
              value={localFilters.area}
              onValueChange={(value) => handleFilterChange("area", value)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full lg:w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select Area" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {areas.map((area) => (
                  <SelectItem key={area.value} value={area.value} className="text-white hover:bg-gray-700">
                    {area.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Advanced Filters Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="border-gray-600 text-gray-300 hover:text-white hover:border-cyan-400"
              disabled={isLoading}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-2 bg-cyan-600 text-white">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>

            {/* Reset Button */}
            {getActiveFiltersCount() > 0 && (
              <Button variant="ghost" onClick={onReset} className="text-gray-400 hover:text-white" disabled={isLoading}>
                <X className="w-4 h-4 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card className="bg-gray-800 border-gray-700 animate-in slide-in-from-top-5 duration-300">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Unit Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Unit Type</label>
                <Select
                  value={localFilters.unitType}
                  onValueChange={(value) => handleFilterChange("unitType", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Any Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {unitTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-white hover:bg-gray-700">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Vacancy Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Vacancy Status</label>
                <Select
                  value={localFilters.vacancyStatus}
                  onValueChange={(value) => handleFilterChange("vacancyStatus", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Any Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {vacancyStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value} className="text-white hover:bg-gray-700">
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Days Vacant */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Days Vacant</label>
                <Select
                  value={localFilters.daysVacant}
                  onValueChange={(value) => handleFilterChange("daysVacant", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Any Duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {daysVacantOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price Range (AED/year)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={localFilters.priceRange.min === 0 ? "" : localFilters.priceRange.min}
                    onChange={(e) => handlePriceRangeChange("min", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white text-sm"
                    disabled={isLoading}
                  />
                  <span className="text-gray-400">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={localFilters.priceRange.max === 1000000 ? "" : localFilters.priceRange.max}
                    onChange={(e) => handlePriceRangeChange("max", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white text-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
