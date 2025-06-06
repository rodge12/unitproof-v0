import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/mock-auth"
import { mockAuth } from "@/lib/mock-auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if user is authenticated
    const {
      data: { user },
    } = await mockAuth.getUser()

    const { data, error } = await mockDatabase.getTowerById(id)

    if (error || !data) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Tower not found" }, { status: 404 })
    }

    // If user is not authenticated, hide sensitive unit data
    if (!user) {
      data.units = data.units.map((unit: any) => ({
        ...unit,
        unit_number: "***",
        rent_price: null,
        contract_end: null,
      }))
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
