import type { Tower, TowerListResponse, FilterOptions, ApiResponse } from "@/types"
import { createClient } from '@/utils/supabase/client';

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
      const supabase = createClient();
      const { data: units, error } = await supabase
        .from('vacant_units')
        .select('tower_name, tower_slug, unit_no, status, last_known_rent, days_vacant, contract_end_date');

      if (error) {
        throw error;
      }

      // Group units by tower
      const towerMap = new Map<string, Tower>();
      
      units.forEach(unit => {
        if (!towerMap.has(unit.tower_name)) {
          // Set fixed total units for Paramount Tower
          const totalUnits = unit.tower_name === "Paramount Tower Hotel & Residences, Business Bay" ? 295 : 0;
          
          towerMap.set(unit.tower_name, {
            name: unit.tower_name,
            slug: unit.tower_slug,
            vacant_units: 0,
            total_units: totalUnits,
            average_rent: 0,
            units: []
          });
        }
        
        const tower = towerMap.get(unit.tower_name)!;
        tower.units.push({
          number: unit.unit_no,
          type: "Apartment", // Default type
          rentPrice: unit.last_known_rent,
          status: unit.status,
          daysVacant: unit.days_vacant,
          contractEndDate: unit.contract_end_date
        });

        // Only count vacant and becoming vacant units
        if (unit.status === 'Vacant' || unit.status === 'Becoming Vacant in 30 Days') {
          tower.vacant_units++;
        }
        if (unit.last_known_rent) {
          tower.average_rent = (tower.average_rent * (tower.units.length - 1) + unit.last_known_rent) / tower.units.length;
        }
      });

      const towers = Array.from(towerMap.values());
      
      // Calculate global stats
      const stats = {
        totalVacantUnits: towers.reduce((sum, tower) => sum + tower.vacant_units, 0),
        averageRent: Math.round(towers.reduce((sum, tower) => sum + tower.average_rent, 0) / towers.length),
        totalRentLoss: towers.reduce((sum, tower) => {
          const vacantUnits = tower.units.filter(u => u.status === 'Vacant' || u.status === 'Becoming Vacant in 30 Days');
          return sum + vacantUnits.reduce((unitSum, unit) => unitSum + (unit.rentPrice || tower.average_rent), 0);
        }, 0),
        totalTowers: towers.length,
        occupancyRate: Math.round((towers.reduce((sum, tower) => sum + (tower.total_units - tower.vacant_units), 0) / 
          towers.reduce((sum, tower) => sum + tower.total_units, 0)) * 100)
      };

      return {
        data: towers,
        success: true,
        stats,
        pagination: {
          page: options.page || 1,
          limit: options.limit || 12,
          total: towers.length
        }
      };
    } catch (error) {
      console.error("Error fetching towers:", error)
      throw new Error("Failed to fetch towers")
    }
  }

  // Get single tower by ID
  async getTowerById(id: string): Promise<ApiResponse<Tower>> {
    try {
      const supabase = createClient();
      const { data: units, error } = await supabase
        .from('vacant_units')
        .select('*')
        .eq('tower_slug', id);

      if (error || !units || units.length === 0) {
        throw new Error("Tower not found");
      }

      const tower: Tower = {
        name: units[0].tower_name,
        slug: units[0].tower_slug,
        vacant_units: units.filter(unit => unit.status === 'Vacant' || unit.status === 'Becoming Vacant in 30 Days').length,
        total_units: units[0].tower_name === "Paramount Tower Hotel & Residences, Business Bay" ? 295 : units.length,
        average_rent: Math.round(units.reduce((sum, unit) => sum + (unit.last_known_rent || 0), 0) / units.length),
        units: units.map(unit => ({
          number: unit.unit_no,
          type: "Apartment", // Default type
          rentPrice: unit.last_known_rent,
          status: unit.status,
          daysVacant: unit.days_vacant,
          contractEndDate: unit.contract_end_date
        }))
      };

      return {
        data: tower,
        success: true,
      };
    } catch (error) {
      console.error("Error fetching tower:", error);
      throw new Error("Failed to fetch tower");
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
      const supabase = createClient();
      const { data: result, error } = await supabase
        .from('leads')
        .insert([data])
        .select();

      if (error) {
        throw error;
      }

      return {
        data: { id: result[0].id },
        success: true,
      };
    } catch (error) {
      console.error("Error submitting lead:", error);
      throw new Error("Failed to submit lead");
    }
  }

  // Export tower data (for premium users)
  async exportTowerData(towerId: string, format: "csv" | "excel" = "csv"): Promise<Blob> {
    try {
      const { data: tower } = await this.getTowerById(towerId);

      if (!tower) {
        throw new Error("Tower not found");
      }

      // Generate CSV content
      const headers = ["Unit Number", "Type", "Rent Price", "Status", "Days Vacant", "Contract End Date"];
      const rows = tower.units.map((unit) => [
        unit.number,
        unit.type,
        unit.rentPrice || "N/A",
        unit.status,
        unit.daysVacant || "N/A",
        unit.contractEndDate || "N/A",
      ]);

      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
      return new Blob([csvContent], { type: "text/csv" });
    } catch (error) {
      console.error("Error exporting data:", error);
      throw new Error("Failed to export data");
    }
  }
}

export const dataService = new DataService()
