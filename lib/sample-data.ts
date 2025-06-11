import type { Unit, Tower } from "@/types"

// Generate more realistic sample units
function generateUnits(towerName: string, count: number): Unit[] {
  const units: Unit[] = []
  const unitTypes: Array<Unit["type"]> = ["Studio", "1BR", "2BR", "3BR", "4BR", "Penthouse"]
  const rentRanges = {
    Studio: [45000, 75000],
    "1BR": [65000, 110000],
    "2BR": [95000, 160000],
    "3BR": [140000, 220000],
    "4BR": [200000, 350000],
    Penthouse: [350000, 600000],
  }

  const sizeRanges = {
    Studio: [400, 600],
    "1BR": [600, 900],
    "2BR": [900, 1400],
    "3BR": [1400, 2000],
    "4BR": [2000, 3000],
    Penthouse: [3000, 5000],
  }

  for (let i = 1; i <= count; i++) {
    const unitType = unitTypes[Math.floor(Math.random() * unitTypes.length)]
    const isVacant = Math.random() < 0.28 // 28% vacancy rate (realistic for Dubai)
    const daysVacant = isVacant ? Math.floor(Math.random() * 400) + 1 : undefined
    const [minRent, maxRent] = rentRanges[unitType]
    const [minSize, maxSize] = sizeRanges[unitType]

    // Generate more realistic contract end dates
    const contractEndDates = [
      "2024-01-15",
      "2024-02-28",
      "2024-03-31",
      "2024-04-30",
      "2024-05-15",
      "2024-06-30",
      "2024-07-31",
      "2024-08-15",
      "2024-09-30",
      "2024-10-31",
      "2024-11-30",
      "2024-12-31",
    ]

    units.push({
      id: `${towerName.toLowerCase().replace(/\s+/g, "-")}-${i.toString().padStart(3, "0")}`,
      number: i.toString().padStart(3, "0"),
      type: unitType,
      size: Math.floor(Math.random() * (maxSize - minSize) + minSize),
      rentPrice: Math.floor(Math.random() * (maxRent - minRent) + minRent),
      status: isVacant ? "vacant" : "occupied",
      contractEndDate: isVacant ? contractEndDates[Math.floor(Math.random() * contractEndDates.length)] : undefined,
      daysVacant,
      notes:
        daysVacant && daysVacant > 150
          ? "Long-term vacancy - potential for sale or owner occupied"
          : daysVacant && daysVacant > 90
            ? "Extended vacancy - may need pricing adjustment"
            : undefined,
      lastUpdated: new Date().toISOString(),
    })
  }

  return units
}

export const sampleTowers: Tower[] = [
  // Paramount Tower
  {
    id: "paramount-tower",
    name: "Paramount Tower",
    area: "Business Bay",
    totalUnits: 500,
    units: generateUnits("Paramount Tower", 500),
    address: "Business Bay, Dubai",
    buildYear: 2018,
    lastUpdated: new Date().toISOString(),
  },
  // Dubai Marina
  {
    id: "princess-tower",
    name: "Princess Tower",
    area: "Dubai Marina",
    totalUnits: 763,
    units: generateUnits("Princess Tower", 763),
    address: "Dubai Marina, Dubai",
    buildYear: 2012,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "23-marina",
    name: "23 Marina",
    area: "Dubai Marina",
    totalUnits: 289,
    units: generateUnits("23 Marina", 289),
    address: "Dubai Marina, Dubai",
    buildYear: 2011,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "elite-residence",
    name: "Elite Residence",
    area: "Dubai Marina",
    totalUnits: 695,
    units: generateUnits("Elite Residence", 695),
    address: "Dubai Marina, Dubai",
    buildYear: 2012,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "marina-pinnacle",
    name: "Marina Pinnacle",
    area: "Dubai Marina",
    totalUnits: 318,
    units: generateUnits("Marina Pinnacle", 318),
    address: "Dubai Marina, Dubai",
    buildYear: 2010,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "ocean-heights",
    name: "Ocean Heights",
    area: "Dubai Marina",
    totalUnits: 548,
    units: generateUnits("Ocean Heights", 548),
    address: "Dubai Marina, Dubai",
    buildYear: 2010,
    lastUpdated: new Date().toISOString(),
  },

  // Downtown Dubai
  {
    id: "burj-khalifa",
    name: "Burj Khalifa",
    area: "Downtown Dubai",
    totalUnits: 900,
    units: generateUnits("Burj Khalifa", 900),
    address: "Downtown Dubai, Dubai",
    buildYear: 2010,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "address-downtown",
    name: "The Address Downtown Dubai",
    area: "Downtown Dubai",
    totalUnits: 196,
    units: generateUnits("The Address Downtown Dubai", 196),
    address: "Downtown Dubai, Dubai",
    buildYear: 2008,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "burj-vista",
    name: "Burj Vista",
    area: "Downtown Dubai",
    totalUnits: 442,
    units: generateUnits("Burj Vista", 442),
    address: "Downtown Dubai, Dubai",
    buildYear: 2019,
    lastUpdated: new Date().toISOString(),
  },

  // JBR
  {
    id: "rimal-1-jbr",
    name: "Rimal 1",
    area: "JBR",
    totalUnits: 380,
    units: generateUnits("Rimal 1", 380),
    address: "Jumeirah Beach Residence, Dubai",
    buildYear: 2007,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "rimal-2-jbr",
    name: "Rimal 2",
    area: "JBR",
    totalUnits: 380,
    units: generateUnits("Rimal 2", 380),
    address: "Jumeirah Beach Residence, Dubai",
    buildYear: 2007,
    lastUpdated: new Date().toISOString(),
  },

  // Business Bay
  {
    id: "executive-towers",
    name: "Executive Towers",
    area: "Business Bay",
    totalUnits: 1200,
    units: generateUnits("Executive Towers", 1200),
    address: "Business Bay, Dubai",
    buildYear: 2010,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "burj-daman",
    name: "Burj Daman",
    area: "Business Bay",
    totalUnits: 335,
    units: generateUnits("Burj Daman", 335),
    address: "Business Bay, Dubai",
    buildYear: 2011,
    lastUpdated: new Date().toISOString(),
  },

  // JVC
  {
    id: "diamond-views-1",
    name: "Diamond Views 1",
    area: "JVC",
    totalUnits: 245,
    units: generateUnits("Diamond Views 1", 245),
    address: "Jumeirah Village Circle, Dubai",
    buildYear: 2015,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "diamond-views-2",
    name: "Diamond Views 2",
    area: "JVC",
    totalUnits: 245,
    units: generateUnits("Diamond Views 2", 245),
    address: "Jumeirah Village Circle, Dubai",
    buildYear: 2016,
    lastUpdated: new Date().toISOString(),
  },

  // JVT
  {
    id: "district-one-villas",
    name: "District One Villas",
    area: "JVT",
    totalUnits: 180,
    units: generateUnits("District One Villas", 180),
    address: "Jumeirah Village Triangle, Dubai",
    buildYear: 2017,
    lastUpdated: new Date().toISOString(),
  },

  // Dubai Hills
  {
    id: "park-ridge",
    name: "Park Ridge",
    area: "Dubai Hills",
    totalUnits: 320,
    units: generateUnits("Park Ridge", 320),
    address: "Dubai Hills Estate, Dubai",
    buildYear: 2020,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "golf-suites",
    name: "Golf Suites",
    area: "Dubai Hills",
    totalUnits: 280,
    units: generateUnits("Golf Suites", 280),
    address: "Dubai Hills Estate, Dubai",
    buildYear: 2021,
    lastUpdated: new Date().toISOString(),
  },

  // Palm Jumeirah
  {
    id: "atlantis-residences",
    name: "Atlantis Residences",
    area: "Palm Jumeirah",
    totalUnits: 156,
    units: generateUnits("Atlantis Residences", 156),
    address: "Palm Jumeirah, Dubai",
    buildYear: 2008,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "tiara-residences",
    name: "Tiara Residences",
    area: "Palm Jumeirah",
    totalUnits: 200,
    units: generateUnits("Tiara Residences", 200),
    address: "Palm Jumeirah, Dubai",
    buildYear: 2010,
    lastUpdated: new Date().toISOString(),
  },

  // Dubai South
  {
    id: "mag-city",
    name: "MAG City",
    area: "Dubai South",
    totalUnits: 450,
    units: generateUnits("MAG City", 450),
    address: "Dubai South, Dubai",
    buildYear: 2019,
    lastUpdated: new Date().toISOString(),
  },
]

// Export individual unit and tower for testing
export type { Unit, Tower }
