"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { mockAuth } from "@/lib/mock-auth"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { Loader2 } from "lucide-react"

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await mockAuth.getUser()

        if (!user) {
          router.push("/")
          return
        }

        const { data: profile } = await mockAuth.getUserProfile(user.id)

        if (!profile || profile.role !== "admin") {
          router.push("/")
          return
        }

        setIsAuthorized(true)
      } catch (error) {
        console.error("Auth error:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    )
  }

  if (!isAuthorized) {
    return null // Router will redirect
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminDashboard />
    </div>
  )
}
