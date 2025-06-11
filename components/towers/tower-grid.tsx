"use client"

import { useState, useEffect, useCallback } from "react"
import { TowerCard } from "@/components/towers/tower-card"
import { TowerFilters } from "@/components/filters/tower-filters"
import { GlobalStatsBar } from "@/components/analytics/global-stats-bar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { dataService } from "@/lib/services/data-service"
import { useUser } from "@/contexts/user-context"
import type { Tower, FilterOptions, GlobalStats, PaginationOptions } from "@/types"

export function TowerGrid() {
  const [towers, setTowers] = useState<Tower[]>([])
  const [featuredTower, setFeaturedTower] = useState<Tower | null>(null)
  const [stats, setStats] = useState<GlobalStats>({
    totalVacantUnits: 0,
    averageRent: 0,
    totalRentLoss: 0,
    totalTowers: 0,
    occupancyRate: 0,
  })
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    limit: 12,
    total: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("name")

  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    area: "all",
    unitType: "",
    vacancyStatus: "",
    daysVacant: "",
    priceRange: { min: 0, max: 1000000 },
  })

  const { user, profile } = useUser()
  const { toast } = useToast()

  // Fetch towers data
  const fetchTowers = useCallback(
    async (page = 1, resetData = true) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await dataService.getTowers({
          filters,
          sortBy,
          page,
          limit: pagination.limit,
        })

        // Find and set the featured tower (Paramount Tower)
        const paramountTower = response.data.find(tower => tower.name === "Paramount Tower Hotel & Residences, Business Bay")
        setFeaturedTower(paramountTower || null)

        // Filter out the featured tower from the main list
        const otherTowers = response.data.filter(tower => tower.name !== "Paramount Tower Hotel & Residences, Business Bay")

        if (resetData) {
          setTowers(otherTowers)
        } else {
          setTowers((prev) => [...prev, ...otherTowers])
        }

        setStats(response.stats)
        setPagination(response.pagination || { page, limit: pagination.limit, total: 0 })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load towers"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [filters, sortBy, pagination.limit, toast],
  )

  // Initial load and filter changes
  useEffect(() => {
    fetchTowers(1, true)
  }, [fetchTowers])

  // Handle filter changes
  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  // Handle filter reset
  const handleFiltersReset = () => {
    const resetFilters: FilterOptions = {
      search: "",
      area: "all",
      unitType: "",
      vacancyStatus: "",
      daysVacant: "",
      priceRange: { min: 0, max: 1000000 },
    }
    setFilters(resetFilters)
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
    fetchTowers(newPage, true)
    // Scroll to top of grid
    document.getElementById("tower-grid")?.scrollIntoView({ behavior: "smooth" })
  }

  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: pagination.limit }).map((_, index) => (
        <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <Skeleton className="h-32 w-full bg-gray-700" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4 bg-gray-700" />
            <Skeleton className="h-4 w-1/2 bg-gray-700" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 bg-gray-700" />
              <Skeleton className="h-6 w-20 bg-gray-700" />
            </div>
            <Skeleton className="h-10 w-full bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  )

  // Error state
  if (error && !isLoading) {
    return (
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Towers</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button
              onClick={() => fetchTowers(pagination.page, true)}
              className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="tower-grid" className="py-16 px-4 bg-gray-900">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Dubai Residential Towers</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore comprehensive data on Dubai's premier residential developments. Advanced filtering and real-time
            analytics at your fingertips.
          </p>
        </div>

        {/* Global Statistics */}
        <GlobalStatsBar stats={stats} isLoading={isLoading} />

        {/* Featured Tower */}
        {featuredTower && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">Featured Tower</h3>
            <div className="grid grid-cols-1">
              <TowerCard
                tower={featuredTower}
                isPreview={false}
                isFeatured={true}
              />
            </div>
          </div>
        )}

        {/* Filters */}
        <TowerFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onFiltersReset={handleFiltersReset}
        />

        {/* Sort Options */}
        <div className="flex justify-end mb-6">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="vacant">Most Vacant</SelectItem>
              <SelectItem value="rent">Highest Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tower Grid */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {towers.map((tower) => (
              <TowerCard
                key={tower.slug}
                tower={tower}
                isPreview={false}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && towers.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <span className="text-white">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* No Results */}
        {!isLoading && towers.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-2">No Towers Found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your filters or search criteria.</p>
            <Button
              onClick={handleFiltersReset}
              className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
