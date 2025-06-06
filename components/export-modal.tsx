"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Download, FileSpreadsheet, CheckCircle } from "lucide-react"
import type { Tower } from "@/lib/sample-data"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  tower: Tower
}

export function ExportModal({ isOpen, onClose, tower }: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [selectedFields, setSelectedFields] = useState({
    unitNumber: true,
    unitType: true,
    rentPrice: true,
    status: true,
    contractEndDate: true,
    daysVacant: true,
    notes: false,
  })

  const { toast } = useToast()

  const handleExport = () => {
    setIsExporting(true)

    // Simulate export process
    setTimeout(() => {
      // Generate CSV content
      const headers = Object.entries(selectedFields)
        .filter(([_, selected]) => selected)
        .map(([field]) => {
          switch (field) {
            case "unitNumber":
              return "Unit Number"
            case "unitType":
              return "Unit Type"
            case "rentPrice":
              return "Rent Price (AED/year)"
            case "status":
              return "Status"
            case "contractEndDate":
              return "Contract End Date"
            case "daysVacant":
              return "Days Vacant"
            case "notes":
              return "Notes"
            default:
              return field
          }
        })

      const rows = tower.units.map((unit) => {
        const row: string[] = []
        if (selectedFields.unitNumber) row.push(unit.number)
        if (selectedFields.unitType) row.push(unit.type)
        if (selectedFields.rentPrice) row.push(String(unit.rentPrice || "N/A"))
        if (selectedFields.status) row.push(unit.status)
        if (selectedFields.contractEndDate) row.push(unit.contractEndDate || "N/A")
        if (selectedFields.daysVacant) row.push(String(unit.daysVacant || "N/A"))
        if (selectedFields.notes) row.push(unit.notes || "")
        return row
      })

      // Create CSV content
      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `${tower.name.replace(/\s+/g, "-")}_units.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setIsExporting(false)
      setExportSuccess(true)

      toast({
        title: "Export successful",
        description: `Data for ${tower.name} has been exported to CSV.`,
      })

      // Reset success state after a delay
      setTimeout(() => {
        setExportSuccess(false)
        onClose()
      }, 2000)
    }, 1500)
  }

  const toggleField = (field: keyof typeof selectedFields) => {
    setSelectedFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center">
            <FileSpreadsheet className="w-5 h-5 mr-2 text-cyan-400" />
            Export Tower Data
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Select the fields you want to include in your export
          </DialogDescription>
        </DialogHeader>

        {exportSuccess ? (
          <div className="py-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">Export Complete</h3>
            <p className="text-gray-400">Your data has been exported successfully</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mt-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-3">Tower Information</h3>
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-400">Name:</span> {tower.name}
                </p>
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-400">Area:</span> {tower.area}
                </p>
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-400">Total Units:</span> {tower.totalUnits}
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Select Fields to Export</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="unitNumber"
                      checked={selectedFields.unitNumber}
                      onCheckedChange={() => toggleField("unitNumber")}
                      className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    <Label htmlFor="unitNumber" className="text-gray-300">
                      Unit Number
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="unitType"
                      checked={selectedFields.unitType}
                      onCheckedChange={() => toggleField("unitType")}
                      className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    <Label htmlFor="unitType" className="text-gray-300">
                      Unit Type
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rentPrice"
                      checked={selectedFields.rentPrice}
                      onCheckedChange={() => toggleField("rentPrice")}
                      className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    <Label htmlFor="rentPrice" className="text-gray-300">
                      Rent Price
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status"
                      checked={selectedFields.status}
                      onCheckedChange={() => toggleField("status")}
                      className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    <Label htmlFor="status" className="text-gray-300">
                      Status
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="contractEndDate"
                      checked={selectedFields.contractEndDate}
                      onCheckedChange={() => toggleField("contractEndDate")}
                      className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    <Label htmlFor="contractEndDate" className="text-gray-300">
                      Contract End Date
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="daysVacant"
                      checked={selectedFields.daysVacant}
                      onCheckedChange={() => toggleField("daysVacant")}
                      className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    <Label htmlFor="daysVacant" className="text-gray-300">
                      Days Vacant
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notes"
                      checked={selectedFields.notes}
                      onCheckedChange={() => toggleField("notes")}
                      className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    <Label htmlFor="notes" className="text-gray-300">
                      Notes
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="outline" className="mr-2 border-gray-700 text-white hover:bg-gray-800" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={isExporting || Object.values(selectedFields).every((v) => !v)}
                className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white"
              >
                {isExporting ? (
                  "Exporting..."
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
