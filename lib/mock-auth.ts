import { sampleTowers } from "@/lib/sample-data"

export type UserRole = "free" | "premium" | "admin"

export interface User {
  id: string
  email: string
}

export interface UserProfile {
  id: string
  user_id: string
  role: UserRole
  subscription_status: "active" | "cancelled" | "expired" | null
  subscription_end_date: string | null
}

// Mock users database
const mockUsers = [
  {
    id: "user-1",
    email: "free@example.com",
    password: "password",
    profile: {
      id: "profile-1",
      user_id: "user-1",
      role: "free" as UserRole,
      subscription_status: null,
      subscription_end_date: null,
    },
  },
  {
    id: "user-2",
    email: "premium@example.com",
    password: "password",
    profile: {
      id: "profile-2",
      user_id: "user-2",
      role: "premium" as UserRole,
      subscription_status: "active",
      subscription_end_date: "2025-12-31",
    },
  },
  {
    id: "user-3",
    email: "admin@example.com",
    password: "password",
    profile: {
      id: "profile-3",
      user_id: "user-3",
      role: "admin" as UserRole,
      subscription_status: "active",
      subscription_end_date: null,
    },
  },
]

// Mock authentication service
export const mockAuth = {
  // Sign in with email and password
  signInWithPassword: async (email: string, password: string) => {
    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      throw new Error("Invalid email or password")
    }

    // Store user in localStorage to persist session
    localStorage.setItem(
      "unitproof_user",
      JSON.stringify({
        id: user.id,
        email: user.email,
      }),
    )

    return {
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
        session: {
          user: {
            id: user.id,
            email: user.email,
          },
        },
      },
      error: null,
    }
  },

  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    const existingUser = mockUsers.find((u) => u.email === email)

    if (existingUser) {
      throw new Error("Email already in use")
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      profile: {
        id: `profile-${Date.now()}`,
        user_id: `user-${Date.now()}`,
        role: "free" as UserRole,
        subscription_status: null,
        subscription_end_date: null,
      },
    }

    // Add to mock users (in a real app, this would persist to a database)
    mockUsers.push(newUser)

    // Store user in localStorage
    localStorage.setItem(
      "unitproof_user",
      JSON.stringify({
        id: newUser.id,
        email: newUser.email,
      }),
    )

    return {
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
        },
        session: {
          user: {
            id: newUser.id,
            email: newUser.email,
          },
        },
      },
      error: null,
    }
  },

  // Sign out
  signOut: async () => {
    localStorage.removeItem("unitproof_user")
    return { error: null }
  },

  // Get current session
  getSession: async () => {
    const userJson = localStorage.getItem("unitproof_user")

    if (!userJson) {
      return { data: { session: null }, error: null }
    }

    try {
      const user = JSON.parse(userJson)
      return {
        data: {
          session: {
            user,
          },
        },
        error: null,
      }
    } catch (error) {
      localStorage.removeItem("unitproof_user")
      return { data: { session: null }, error: null }
    }
  },

  // Get current user
  getUser: async () => {
    const userJson = localStorage.getItem("unitproof_user")

    if (!userJson) {
      return { data: { user: null }, error: null }
    }

    try {
      const user = JSON.parse(userJson)
      return { data: { user }, error: null }
    } catch (error) {
      localStorage.removeItem("unitproof_user")
      return { data: { user: null }, error: null }
    }
  },

  // Get user profile
  getUserProfile: async (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId)

    if (!user) {
      return { data: null, error: null }
    }

    return { data: user.profile, error: null }
  },

  // Create user profile
  createUserProfile: async (userId: string, role: UserRole = "free") => {
    const user = mockUsers.find((u) => u.id === userId)

    if (!user) {
      return { data: null, error: new Error("User not found") }
    }

    user.profile = {
      id: `profile-${Date.now()}`,
      user_id: userId,
      role,
      subscription_status: null,
      subscription_end_date: null,
    }

    return { data: user.profile, error: null }
  },
}

// Mock database service
export const mockDatabase = {
  // Get all towers
  getTowers: async (options: any = {}) => {
    const { filters, sortBy, page = 1, limit = 12 } = options

    // Apply filters if provided
    let filteredTowers = [...sampleTowers]

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filteredTowers = filteredTowers.filter(
        (tower) => tower.name.toLowerCase().includes(search) || tower.area.toLowerCase().includes(search),
      )
    }

    if (filters?.area && filters.area !== "all") {
      filteredTowers = filteredTowers.filter((tower) => tower.area.toLowerCase().includes(filters.area.toLowerCase()))
    }

    // Apply sorting
    if (sortBy) {
      filteredTowers.sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name)
        } else if (sortBy === "area") {
          return a.area.localeCompare(b.area)
        } else if (sortBy === "vacancy-high") {
          const aVacant = a.units.filter((u) => u.status === "vacant").length
          const bVacant = b.units.filter((u) => u.status === "vacant").length
          return bVacant - aVacant
        } else if (sortBy === "vacancy-low") {
          const aVacant = a.units.filter((u) => u.status === "vacant").length
          const bVacant = b.units.filter((u) => u.status === "vacant").length
          return aVacant - bVacant
        }
        return 0
      })
    }

    // Calculate total
    const total = filteredTowers.length

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTowers = filteredTowers.slice(startIndex, endIndex)

    // Calculate global stats
    const allUnits = filteredTowers.flatMap((tower) => tower.units)
    const vacantUnits = allUnits.filter((unit) => unit.status === "vacant")
    const rentPrices = allUnits.filter((unit) => unit.rentPrice).map((unit) => unit.rentPrice as number)

    const averageRent =
      rentPrices.length > 0 ? Math.round(rentPrices.reduce((sum, price) => sum + price, 0) / rentPrices.length) : 0

    const totalRentLoss = vacantUnits.reduce((total, unit) => {
      return total + (unit.rentPrice || averageRent)
    }, 0)

    const occupancyRate =
      allUnits.length > 0 ? Math.round(((allUnits.length - vacantUnits.length) / allUnits.length) * 100) : 0

    return {
      data: paginatedTowers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalVacantUnits: vacantUnits.length,
        averageRent,
        totalRentLoss,
        totalTowers: filteredTowers.length,
        occupancyRate,
      },
    }
  },

  // Get tower by ID
  getTowerById: async (id: string) => {
    const tower = sampleTowers.find((t) => t.id === id)

    if (!tower) {
      return { data: null, error: new Error("Tower not found") }
    }

    return { data: tower, error: null }
  },

  // Submit lead form
  submitLead: async (data: any) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      data: { id: `lead-${Date.now()}` },
      success: true,
      message: "Lead submitted successfully",
    }
  },

  // Upload CSV data (admin only)
  uploadCSV: async (formData: FormData) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return {
      success: true,
      towersCreated: Math.floor(Math.random() * 10) + 1,
      unitsCreated: Math.floor(Math.random() * 100) + 10,
    }
  },
}
