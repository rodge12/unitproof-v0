"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mockAuth, type User, type UserProfile } from "@/lib/mock-auth"

interface UserContextType {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await mockAuth.getSession()

        if (sessionError) {
          console.error("Error getting session:", sessionError)
          setError(sessionError.message)
          return
        }

        setUser(session?.user ?? null)

        if (session?.user) {
          await fetchUserProfile(session.user.id)
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
        setError("Failed to connect to authentication service")
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Set up event listener for storage changes (for multi-tab support)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "unitproof_user") {
        if (event.newValue) {
          try {
            const userData = JSON.parse(event.newValue)
            setUser(userData)
            fetchUserProfile(userData.id)
          } catch (error) {
            console.error("Error parsing user data:", error)
          }
        } else {
          setUser(null)
          setProfile(null)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await mockAuth.getUserProfile(userId)

      if (error) {
        console.error("Error fetching user profile:", error)
        return
      }

      if (!data) {
        // Create default profile for new users
        const { data: newProfile, error: createError } = await mockAuth.createUserProfile(userId)

        if (createError) {
          console.error("Error creating user profile:", createError)
          return
        }

        setProfile(newProfile)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error)
    }
  }

  const signIn = async (email: string, password: string) => {
    setError(null)
    try {
      const { data, error } = await mockAuth.signInWithPassword(email, password)

      if (error) {
        setError(error.message)
        throw error
      }

      setUser(data.user)
      await fetchUserProfile(data.user.id)
    } catch (error: any) {
      setError(error.message || "Failed to sign in")
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    setError(null)
    try {
      const { data, error } = await mockAuth.signUp(email, password)

      if (error) {
        setError(error.message)
        throw error
      }

      setUser(data.user)
      await fetchUserProfile(data.user.id)
    } catch (error: any) {
      setError(error.message || "Failed to sign up")
      throw error
    }
  }

  const signOut = async () => {
    setError(null)
    const { error } = await mockAuth.signOut()
    if (error) {
      setError(error.message)
      throw error
    }
    setUser(null)
    setProfile(null)
  }

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        isLoading,
        error,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
