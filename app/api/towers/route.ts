import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/mock-auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const search = searchParams.get("search")?.toLowerCase() || ""
    const area = searchParams.get("area")?.toLowerCase() || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")

    // Use mock database
    const response = await mockDatabase.getTowers({
      filters: { search, area },
      page,
      limit,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
