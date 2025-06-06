import { type NextRequest, NextResponse } from "next/server"
import { mockAuth, mockDatabase } from "@/lib/mock-auth"

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const {
      data: { user },
    } = await mockAuth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await mockAuth.getUserProfile(user.id)

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Use mock database
    const response = await mockDatabase.uploadCSV(formData)

    return NextResponse.json(response)
  } catch (error) {
    console.error("CSV upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
