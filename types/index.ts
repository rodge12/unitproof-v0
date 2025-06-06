// Core data types - ready for backend integration
export interface Unit {
  id: string
  number: string
  type: "Studio" | "1BR" | "2BR" | "3BR" | "4BR" | "Penthouse"
  size?: number // Square feet
  rentPrice?: number
  status: "occupied" | "vacant"
  contractEndDate?: string
  daysVacant?: number
  notes?: string
  // Future backend fields
  ownerId?: string
  lastUpdated?: string
  floorNumber?: number
}

export interface Tower {
  id: string
  name: string
  area: string
  totalUnits: number
  units: Unit[]
  // Future backend fields
  address?: string
  coordinates?: { lat: number; lng: number }
  buildYear?: number
  amenities?: string[]
  lastUpdated?: string
}

export interface FilterOptions {
  search: string
  area: string
  unitType: string
  vacancyStatus: string
  daysVacant: string
  priceRange: { min: number; max: number }
}

export interface GlobalStats {
  totalVacantUnits: number
  averageRent: number
  totalRentLoss: number
  totalTowers: number
  occupancyRate: number
}

export interface PaginationOptions {
  page: number
  limit: number
  total: number
}

// User and subscription types
export type UserRole = "free" | "premium" | "admin"

export interface User {
  id: string
  email: string
  role: UserRole
  subscription?: {
    plan: string
    status: "active" | "cancelled" | "expired"
    expiresAt: string
  }
}

// API response types - ready for backend
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  pagination?: PaginationOptions
}

export interface TowerListResponse extends ApiResponse<Tower[]> {
  stats: GlobalStats
}
