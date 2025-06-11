'use client';

import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DownloadButton } from '../towers/[tower]/DownloadButton';

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

type DataPreviewProps = {
  initialData: Tower[];
};

export function DataPreview({ initialData }: DataPreviewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTower, setSelectedTower] = useState<string>('all');

  // Get unique statuses for filter
  const statuses = useMemo(() => {
    if (!initialData || !Array.isArray(initialData)) return [];
    
    const uniqueStatuses = new Set<string>();
    initialData.forEach(tower => {
      if (tower.units && Array.isArray(tower.units)) {
        tower.units.forEach(unit => {
          if (unit.status) {
            uniqueStatuses.add(unit.status);
          }
        });
      }
    });
    return Array.from(uniqueStatuses).sort();
  }, [initialData]);

  // Filter and search data
  const filteredData = useMemo(() => {
    if (!initialData || !Array.isArray(initialData)) return [];
    
    return initialData
      .filter(tower => selectedTower === 'all' || tower.slug === selectedTower)
      .map(tower => ({
        ...tower,
        units: (tower.units || []).filter(unit => {
          const matchesSearch = 
            (unit.unit?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (unit.status?.toLowerCase() || '').includes(searchQuery.toLowerCase());
          const matchesStatus = statusFilter === 'all' || unit.status === statusFilter;
          return matchesSearch && matchesStatus;
        })
      }))
      .filter(tower => tower.units.length > 0);
  }, [initialData, searchQuery, statusFilter, selectedTower]);

  // Get total counts
  const totalUnits = useMemo(() => {
    return filteredData.reduce((sum, tower) => sum + (tower.units?.length || 0), 0);
  }, [filteredData]);

  if (!initialData || !Array.isArray(initialData)) {
    return <div className="text-white">No data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Search units or status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-800 border-gray-700"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-gray-800 border-gray-700">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map(status => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedTower} onValueChange={setSelectedTower}>
          <SelectTrigger className="bg-gray-800 border-gray-700">
            <SelectValue placeholder="Filter by tower" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Towers</SelectItem>
            {initialData.map(tower => (
              <SelectItem key={tower.slug} value={tower.slug}>
                {tower.tower}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary */}
      <div className="text-gray-300">
        Showing {totalUnits} units across {filteredData.length} towers
      </div>

      {/* Towers */}
      <div className="space-y-6">
        {filteredData.map(tower => (
          <Card key={tower.slug} className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">{tower.tower}</CardTitle>
              <DownloadButton tower={tower} />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {tower.units.map(unit => (
                  <div
                    key={unit.unit}
                    className="bg-gray-700/50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div>
                      <h4 className="font-semibold">Unit {unit.unit}</h4>
                      <Badge
                        className={`mt-2 ${
                          unit.status.includes('Vacant')
                            ? 'bg-red-500/20 text-red-300'
                            : unit.status.includes('Rented')
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}
                      >
                        {unit.status}
                      </Badge>
                    </div>
                    <div className="text-gray-300">
                      <p>
                        <span className="font-medium">Contract End:</span>{' '}
                        {unit.lastContractEndDate || '—'}
                      </p>
                      <p>
                        <span className="font-medium">Days Vacant:</span>{' '}
                        {unit.daysVacant ? `${unit.daysVacant} days` : '—'}
                      </p>
                    </div>
                    <div className="text-gray-300">
                      <p>
                        <span className="font-medium">Last Known Rent:</span>{' '}
                        {unit.rent
                          ? `AED ${unit.rent.toLocaleString()}`
                          : '—'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 