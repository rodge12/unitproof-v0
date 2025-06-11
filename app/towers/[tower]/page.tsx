import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { DownloadButton } from './DownloadButton';
import { isValidSlug, slugToName, createSlug } from '@/utils/slug';

type Unit = {
  unit: string;
  floor: number;
  type: string;
  rent: number;
  status: string;
};

type Tower = {
  tower: string;
  tower_name: string;
  units: Unit[];
};

type VacantUnit = {
  unit_no: string;
  tower_name: string;
  unit_type: string;
  last_known_rent: number;
  status: string;
};

// This function runs at build time to generate all possible tower pages
export async function generateStaticParams() {
  // Create Supabase client without cookies for static generation
  const supabase = createClient();

  // Fetch all unique tower names
  const { data: towers, error } = await supabase
    .from('vacant_units')
    .select('tower_name')
    .order('tower_name');

  if (error) {
    console.error('Error fetching tower names:', error);
    return [];
  }

  // Get unique tower names and convert to slugs
  const uniqueTowers = [...new Set(towers?.map(t => t.tower_name) || [])];
  
  return uniqueTowers.map(towerName => ({
    tower: createSlug(towerName)
  }));
}

// Make the page static
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default async function TowerPage({ params }: { params: { tower: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Fetch all units for the tower using the slug
  const { data: units, error } = await supabase
    .from('vacant_units')
    .select('*')
    .eq('tower_slug', params.tower)
    .order('unit_no');

  if (error) {
    console.error('Error fetching tower data:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Error Loading Tower</h1>
        <p className="text-red-500">Failed to load tower data. Please try again later.</p>
      </div>
    );
  }

  if (!units || units.length === 0) {
    notFound();
  }

  // Get the tower name from the first unit
  const towerName = units[0].tower_name;

  // Calculate summary statistics
  const totalUnits = units.length;
  const vacantUnits = units.filter((unit: VacantUnit) => unit.status === 'Vacant').length;
  const rentedUnits = units.filter((unit: VacantUnit) => unit.status === 'Rented').length;
  const averageRent = Math.round(
    units.reduce((sum: number, unit: VacantUnit) => sum + (unit.last_known_rent || 0), 0) / units.length
  );

  // Format the data for the tower
  const tower: Tower = {
    tower: towerName,
    tower_name: towerName,
    units: units.map((unit: VacantUnit) => ({
      unit: unit.unit_no,
      floor: parseInt(unit.unit_no.replace(/\D/g, '')),
      type: unit.unit_type,
      rent: unit.last_known_rent,
      status: unit.status
    }))
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{tower.tower}</h1>
        <DownloadButton tower={tower} />
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400">Total Units</h3>
          <p className="text-2xl font-semibold">{totalUnits}</p>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400">Vacant Units</h3>
          <p className="text-2xl font-semibold text-green-400">{vacantUnits}</p>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400">Rented Units</h3>
          <p className="text-2xl font-semibold text-blue-400">{rentedUnits}</p>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400">Average Rent</h3>
          <p className="text-2xl font-semibold">AED {averageRent.toLocaleString()}</p>
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tower.units.map((unit) => (
          <div
            key={unit.unit}
            className="bg-gray-700/50 p-4 rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">Unit {unit.unit}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                unit.status === 'Vacant' ? 'bg-green-400/20 text-green-400' : 'bg-blue-400/20 text-blue-400'
              }`}>
                {unit.status}
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-400">
              <p>Floor {unit.floor}</p>
              <p>{unit.type}</p>
              {unit.rent && (
                <p className="text-white">AED {unit.rent.toLocaleString()}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}