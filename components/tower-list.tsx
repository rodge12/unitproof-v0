'use client';

import { useState, ChangeEvent } from 'react';
import Link from 'next/link';
import { createSlug } from '@/utils/slug';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Search } from 'lucide-react';

const FLAGSHIP_TOWER = "Paramount Tower Hotel & Residences, Business Bay";

type Tower = {
  name: string;
  vacantUnits: number;
};

type TowerListProps = {
  towers: Tower[];
  isLoading?: boolean;
};

type SortOption = 'name-asc' | 'name-desc' | 'vacant-asc' | 'vacant-desc';

function TowerSkeleton() {
  return (
    <div className="p-4 bg-gray-700/50 rounded-lg animate-pulse">
      <div className="h-5 bg-gray-600 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-600 rounded w-1/2"></div>
    </div>
  );
}

function EmptyState({ message, icon: Icon = Building2 }: { message: string; icon?: any }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 text-gray-400 mb-4">
        <Icon className="w-full h-full" />
      </div>
      <h3 className="text-lg font-medium text-gray-200 mb-2">No Towers Found</h3>
      <p className="text-gray-400 max-w-sm">{message}</p>
    </div>
  );
}

export function TowerList({ towers, isLoading = false }: TowerListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');

  // Filter towers based on search query
  const filteredTowers = towers.filter(tower =>
    tower.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort towers based on selected option
  const sortedTowers = [...filteredTowers].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'vacant-asc':
        return a.vacantUnits - b.vacantUnits;
      case 'vacant-desc':
        return b.vacantUnits - a.vacantUnits;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search towers..."
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
            disabled={isLoading}
          />
          {searchQuery && !isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {filteredTowers.length} results
            </div>
          )}
        </div>
        <Select 
          value={sortBy} 
          onValueChange={(value: SortOption) => setSortBy(value)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[200px] bg-gray-700/50 border-gray-600 text-white">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="vacant-asc">Vacant Units (Low to High)</SelectItem>
            <SelectItem value="vacant-desc">Vacant Units (High to Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tower Grid or Empty State */}
      {isLoading ? (
        // Show 6 skeleton cards while loading
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <TowerSkeleton key={index} />
          ))}
        </div>
      ) : towers.length === 0 ? (
        <EmptyState 
          message="There are no towers available at the moment. Please check back later for updates."
        />
      ) : searchQuery && filteredTowers.length === 0 ? (
        <EmptyState 
          icon={Search}
          message={`No towers found matching "${searchQuery}". Try adjusting your search or browse all available towers.`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTowers.map((tower) => {
            const isFlagship = tower.name === FLAGSHIP_TOWER;
            return (
              <Link
                key={tower.name}
                href={`/towers/${createSlug(tower.name)}`}
                className={`block p-4 rounded-lg hover:bg-gray-700 transition-colors bg-gray-700/50 relative ${isFlagship ? 'ring-2 ring-yellow-400 ring-offset-2 shadow-lg shadow-yellow-400/30 animate-pulse-slow' : ''}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium flex-1">{tower.name}</h3>
                  {isFlagship && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-400 text-gray-900 shadow animate-glow">Flagship</span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {tower.vacantUnits} vacant {tower.vacantUnits === 1 ? 'unit' : 'units'}
                </p>
              </Link>
            );
          })}
        </div>
      )}

      {/* Total Count */}
      {!isLoading && towers.length > 0 && (
        <div className="text-gray-400 text-sm">
          <p>Total Towers: {towers.length}</p>
        </div>
      )}
    </div>
  );
}

// Add custom animation for glowing badge
// Add this to your global CSS:
// @keyframes glow { 0%, 100% { box-shadow: 0 0 8px 2px #facc15; } 50% { box-shadow: 0 0 16px 4px #facc15; } }
// .animate-glow { animation: glow 1.5s infinite alternate; }
// .animate-pulse-slow { animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; } 