'use client';

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from 'xlsx';

type Unit = {
  unit: string;
  status: string;
  lastContractEndDate: string;
  daysVacant: number | null;
  rent: number | null;
};

type Tower = {
  tower: string;
  slug: string;
  units: Unit[];
};

export function DownloadButton({ tower }: { tower: Tower }) {
  const handleDownload = () => {
    // Prepare data for Excel
    const data = tower.units.map(unit => ({
      'Unit No.': unit.unit,
      'Status': unit.status,
      'Contract End Date': unit.lastContractEndDate || '',
      'Days Vacant': unit.daysVacant || '',
      'Last Known Rent': unit.rent ? `AED ${unit.rent.toLocaleString()}` : ''
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Units');

    // Generate Excel file
    XLSX.writeFile(wb, `${tower.tower} - Units.xlsx`);
  };

  return (
    <Button
      onClick={handleDownload}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
    >
      <Download className="h-4 w-4" />
      Download Excel
    </Button>
  );
} 