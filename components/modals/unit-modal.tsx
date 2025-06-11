"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { dataService } from "@/lib/services/data-service"
import { Download, Loader2 } from "lucide-react"
import type { Tower } from "@/types"

type UnitModalProps = {
  tower: Tower;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UnitModal({ tower, open, onOpenChange }: UnitModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
    setIsLoading(true)
    try {
      const blob = await dataService.exportTowerData(tower.slug)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${tower.name.toLowerCase().replace(/\s+/g, "-")}-units.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to export data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{tower.name} Units</DialogTitle>
            <Button
              onClick={handleExport}
              disabled={isLoading}
              className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export to CSV
                </>
              )}
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Units</p>
                <p className="text-lg font-semibold">{tower.total_units}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Vacant Units</p>
                <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">{tower.vacant_units}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Average Rent</p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {tower.average_rent > 0 ? `${(tower.average_rent / 1000).toFixed(0)}K AED` : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Occupancy Rate</p>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {Math.round(((tower.total_units - tower.vacant_units) / tower.total_units) * 100)}%
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Unit</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Rent</th>
                  <th className="text-left py-3 px-4">Days Vacant</th>
                  <th className="text-left py-3 px-4">Contract End</th>
                </tr>
              </thead>
              <tbody>
                {tower.units.map((unit) => (
                  <tr key={unit.number} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">{unit.number}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          unit.status === "Vacant"
                            ? "destructive"
                            : unit.status === "Becoming Vacant in 30 Days"
                            ? "warning"
                            : "default"
                        }
                      >
                        {unit.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {unit.rentPrice ? `${(unit.rentPrice / 1000).toFixed(0)}K AED` : "N/A"}
                    </td>
                    <td className="py-3 px-4">{unit.daysVacant || "N/A"}</td>
                    <td className="py-3 px-4">{unit.contractEndDate || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
