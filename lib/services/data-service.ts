import type { Tower, TowerListResponse, FilterOptions, ApiResponse } from "@/types"
import { mockDatabase } from "@/lib/mock-auth"

class DataService {
  // Get towers with filtering, sorting, and pagination
  async getTowers(
    options: {
      filters?: FilterOptions
      sortBy?: string
      page?: number
      limit?: number
    } = {},
  ): Promise<TowerListResponse> {
    try {
      // Use mock database instead of API call
      const response = await mockDatabase.getTowers(options)

      return {
        data: response.data,
        success: true,
        stats: response.stats,
        pagination: response.pagination,
      }
    } catch (error) {
      console.error("Error fetching towers:", error)
      throw new Error("Failed to fetch towers")
    }
  }

  // Get single tower by ID
  async getTowerById(id: string): Promise<ApiResponse<Tower>> {
    try {
      const { data, error } = await mockDatabase.getTowerById(id)

      if (error) {
        throw error
      }

      return {
        data: data as Tower,
        success: true,
      }
    } catch (error) {
      console.error("Error fetching tower:", error)
      throw new Error("Failed to fetch tower")
    }
  }

  // Submit lead form
  async submitLead(data: {
    name: string
    email: string
    phone?: string
    towerName?: string
    message?: string
  }): Promise<ApiResponse<{ id: string }>> {
    try {
      const response = await mockDatabase.submitLead(data)
      return response as ApiResponse<{ id: string }>
    } catch (error) {
      console.error("Error submitting lead:", error)
      throw new Error("Failed to submit lead")
    }
  }

  // Export tower data (for premium users)
  async exportTowerData(towerId: string, format: "csv" | "excel" = "csv"): Promise<Blob> {
    try {
      const { data, error } = await mockDatabase.getTowerById(towerId)

      if (error || !data) {
        throw new Error("Tower not found")
      }

      const tower = data as Tower

      // Generate CSV content
      const headers = ["Unit Number", "Type", "Rent Price", "Status", "Days Vacant", "Contract End Date"]
      const rows = tower.units.map((unit) => [
        unit.number,
        unit.type,
        unit.rentPrice || "N/A",
        unit.status,
        unit.daysVacant || "N/A",
        unit.contractEndDate || "N/A",
      ])

      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
      return new Blob([csvContent], { type: "text/csv" })
    } catch (error) {
      console.error("Error exporting data:", error)
      throw new Error("Failed to export data")
    }
  }
}

export const dataService = new DataService()
