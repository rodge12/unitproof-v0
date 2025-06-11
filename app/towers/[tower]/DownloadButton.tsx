'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

type Unit = {
  unit_no: string;
  status: string;
  last_known_rent: number;
  contract_end_date: string;
};

type Tower = {
  name: string;
  units: Unit[];
  total_units: number;
  vacant_units: number;
  rented_units: number;
  average_rent: number;
};

export function DownloadButton({ tower }: { tower: Tower }) {
  const handleDownload = () => {
    const data = {
      tower: tower.name,
      summary: {
        total_units: tower.total_units,
        vacant_units: tower.vacant_units,
        rented_units: tower.rented_units,
        average_rent: tower.average_rent,
      },
      units: tower.units,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tower.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Download Data
    </Button>
  );
} 