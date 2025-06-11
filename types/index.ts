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
  id: string;
  name: string;
  image_url: string;
  total_units: number;
  vacant_units: number;
  average_rent: number;
  area: string;
}

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

export interface UserContextType {
  isAuthenticated: boolean;
  userRole: 'free' | 'paid';
  login: () => void;
  logout: () => void;
}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface TowerFiltersProps {
  filters: {
    area: string[];
    minRent: number;
    maxRent: number;
    status: string[];
  };
  onFiltersChange: (filters: any) => void;
  onFiltersReset: () => void;
}
