import type { Tower, Unit, GlobalStats, FilterOptions } from "@/types"

// Calculate global statistics from tower data
export function calculateGlobalStats(towers: Tower[]): GlobalStats {
  const allUnits = towers.flatMap((tower) => tower.units)
  const vacantUnits = allUnits.filter((unit) => unit.status === "vacant")
  const rentPrices = allUnits.filter((unit) => unit.rentPrice).map((unit) => unit.rentPrice!)

  const averageRent =
    rentPrices.length > 0 ? Math.round(rentPrices.reduce((sum, price) => sum + price, 0) / rentPrices.length) : 0

  const totalRentLoss = vacantUnits.reduce((total, unit) => {
    return total + (unit.rentPrice || averageRent)
  }, 0)

  const occupancyRate =
    allUnits.length > 0 ? Math.round(((allUnits.length - vacantUnits.length) / allUnits.length) * 100) : 0

  return {
    totalVacantUnits: vacantUnits.length,
    averageRent,
    totalRentLoss,
    totalTowers: towers.length,
    occupancyRate,
  }
}

// Filter towers based on criteria
export function filterTowers(towers: Tower[], filters: FilterOptions): Tower[] {
  return towers.filter((tower) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesName = tower.name.toLowerCase().includes(searchLower)
      const matchesArea = tower.area.toLowerCase().includes(searchLower)
      if (!matchesName && !matchesArea) return false
    }

    // Area filter
    if (filters.area && filters.area !== "all") {
      if (!tower.area.toLowerCase().includes(filters.area.toLowerCase())) return false
    }

    // Check if tower has units matching the criteria
    const hasMatchingUnits = tower.units.some((unit) => {
      // Unit type filter
      if (filters.unitType && !unit.type.toLowerCase().includes(filters.unitType.toLowerCase())) {
        return false
      }

      // Price range filter
      if (unit.rentPrice) {
        if (unit.rentPrice < filters.priceRange.min || unit.rentPrice > filters.priceRange.max) {
          return false
        }
      }

      // Vacancy status filter
      if (filters.vacancyStatus) {
        switch (filters.vacancyStatus) {
          case "vacant":
            if (unit.status !== "vacant") return false
            break
          case "occupied":
            if (unit.status !== "occupied") return false
            break
          case "long-vacant":
            if (unit.status !== "vacant" || !unit.daysVacant || unit.daysVacant <= 150) return false
            break
        }
      }

      // Days vacant filter
      if (filters.daysVacant && unit.status === "vacant" && unit.daysVacant) {
        const minDays = Number.parseInt(filters.daysVacant.replace("+", ""))
        if (unit.daysVacant < minDays) return false
      }

      return true
    })

    return hasMatchingUnits
  })
}

// Get vacancy status with color coding
export function getVacancyStatus(unit: Unit): { label: string; color: string; bgColor: string } {
  if (unit.status === "occupied") {
    return { label: "Occupied", color: "text-gray-300", bgColor: "bg-gray-700" }
  }

  if (unit.daysVacant && unit.daysVacant > 150) {
    return { label: "Long Vacant", color: "text-red-300", bgColor: "bg-red-900" }
  }

  return { label: "Vacant", color: "text-green-300", bgColor: "bg-green-900" }
}

// Sort towers by various criteria
export function sortTowers(towers: Tower[], sortBy: string): Tower[] {
  return [...towers].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "area":
        return a.area.localeCompare(b.area)
      case "vacancy-high":
        const aVacant = a.units.filter((u) => u.status === "vacant").length
        const bVacant = b.units.filter((u) => u.status === "vacant").length
        return bVacant - aVacant
      case "vacancy-low":
        const aVacantLow = a.units.filter((u) => u.status === "vacant").length
        const bVacantLow = b.units.filter((u) => u.status === "vacant").length
        return aVacantLow - bVacantLow
      default:
        return 0
    }
  })
}

// Paginate data
export function paginateData<T>(
  data: T[],
  page: number,
  limit: number,
): { data: T[]; pagination: { page: number; limit: number; total: number; totalPages: number } } {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedData = data.slice(startIndex, endIndex)

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit),
    },
  }
}
