import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { DownloadButton } from './DownloadButton';
import { isValidSlug, slugToName } from '@/utils/slug';

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

export default async function TowerPage({ params }: { params: { slug: string } }) {
  // Validate the slug format
  if (!isValidSlug(params.slug)) {
    return (
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold mb-4">Invalid Tower URL</h1>
        <p>The tower URL format is invalid.</p>
      </div>
    );
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Fetch all units for the tower
  const { data: units, error } = await supabase
    .from('vacant_units')
    .select('*')
    .eq('tower_slug', params.slug);

  if (error) {
    console.error('Error fetching tower data:', error);
    return (
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold mb-4">Error loading tower data</h1>
        <p>Please try again later.</p>
      </div>
    );
  }

  if (!units || units.length === 0) {
    return (
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold mb-4">No data found for this tower</h1>
        <p>The requested tower could not be found in our database.</p>
      </div>
    );
  }

  // Get tower name from the first unit
  const towerName = units[0].tower_name;
  const tower: Tower = {
    tower_name: towerName,
    units: units.map(unit => ({
      unit_no: unit.unit_no,
      status: unit.status,
      last_contract_end_date: unit.last_contract_end_date,
      days_vacant: unit.days_vacant,
      last_known_rent: unit.last_known_rent
    }))
  };

  return (
    <main className="p-4 md:p-8 text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">{tower.tower_name}</h1>
        <DownloadButton tower={tower} />
      </div>
      <div className="grid gap-4 md:gap-6">
        {tower.units.map((unit) => (
          <div
            key={unit.unit_no}
            className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="p-4 md:p-6">
              {/* Unit Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 pb-4 border-b border-gray-700">
                <h3 className="text-lg md:text-xl font-semibold">Unit {unit.unit_no}</h3>
                <span
                  className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${
                    unit.status.includes('Vacant')
                      ? 'bg-red-500/20 text-red-300'
                      : unit.status.includes('Rented')
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}
                >
                  {unit.status}
                </span>
              </div>

              {/* Unit Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">Contract End Date</p>
                    <p className="text-gray-200">{unit.last_contract_end_date || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">Days Vacant</p>
                    <p className="text-gray-200">
                      {unit.days_vacant ? `${unit.days_vacant} days` : '—'}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">Last Known Rent</p>
                    <p className="text-gray-200">
                      {unit.last_known_rent ? `AED ${unit.last_known_rent.toLocaleString()}` : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
} 