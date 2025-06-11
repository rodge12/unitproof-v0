'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, Search, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Tower = {
  name: string;
  slug: string;
  vacant_units: number;
};

const FLAGSHIP_TOWER = 'Paramount Tower Hotel & Residences, Business Bay';

export function TowerList({ towers }: { towers: Tower[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredTowers = towers.filter(tower =>
    tower.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTowers = [...filteredTowers].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search towers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
        </Button>
      </div>

      {sortedTowers.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No towers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? `No towers matching "${searchQuery}"`
              : 'No towers available'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTowers.map((tower) => (
            <Link
              key={tower.name}
              href={`/towers/${tower.slug}`}
              className={`block p-6 rounded-lg border transition-all hover:shadow-lg ${
                tower.name === FLAGSHIP_TOWER
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-900">
                  {tower.name}
                </h2>
                {tower.name === FLAGSHIP_TOWER && (
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Flagship
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {tower.vacant_units} vacant {tower.vacant_units === 1 ? 'unit' : 'units'}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 text-gray-400 text-sm">
        <p>Total Towers: {towers.length}</p>
        {searchQuery && (
          <p>Showing {filteredTowers.length} matching towers</p>
        )}
      </div>
    </div>
  );
} 