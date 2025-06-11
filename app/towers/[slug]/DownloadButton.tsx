'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

type Unit = {
  unit_no: string;
  status: string;
  last_contract_end_date: string;
  days_vacant: number | null;
  last_known_rent: number | null;
};

type Tower = {
  tower_name: string;
  units: Unit[];
};

type DownloadButtonProps = {
  tower: Tower;
};

export function DownloadButton({ tower }: DownloadButtonProps) {
  const handleDownload = () => {
    // Prepare data for Excel
    const data = tower.units.map(unit => ({
      'Unit No.': unit.unit_no,
      'Status': unit.status,
      'Contract End Date': unit.last_contract_end_date || '',
      'Days Vacant': unit.days_vacant || '',
      'Last Known Rent': unit.last_known_rent ? `AED ${unit.last_known_rent.toLocaleString()}` : ''
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Units');

    // Generate Excel file
    XLSX.writeFile(wb, `${tower.tower_name} - Units.xlsx`);
  };

  return (
    <Button
      onClick={handleDownload}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      <Download className="w-4 h-4 mr-2" />
      Download Excel
    </Button>
  );
} 