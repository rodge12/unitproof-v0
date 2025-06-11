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

export type Tower = {
  name: string;
  area: string;
  slug: string;
  total_units: number;
  vacant_units: number;
  average_rent: number;
};

export type Unit = {
  id: string;
  unit_number: string;
  contract_end_date: string;
  days_vacant: number;
  last_known_rent: number;
  status: 'Vacant' | 'Tenanted' | 'For Sale' | 'Long Vacant';
};

export type TowerWithUnits = Tower & {
  units: Unit[];
};

export type FilterOptions = {
  search: string;
  area: string;
  unitType: string;
  vacancyStatus: string;
  daysVacant: string;
  priceRange: {
    min: number;
    max: number;
  };
};

export type GlobalStats = {
  totalVacantUnits: number;
  averageRent: number;
  totalRentLoss: number;
  totalTowers: number;
  occupancyRate: number;
};

export type PaginationOptions = {
  page: number;
  limit: number;
  total: number;
};

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
export type ApiResponse<T> = {
  data: T;
  success: boolean;
  error?: string;
};

export type TowerListResponse = {
  data: Tower[];
  success: boolean;
  stats: GlobalStats;
  pagination: PaginationOptions;
};
