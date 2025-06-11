import { createServerClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { DownloadButton } from './DownloadButton';

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

type VacantUnit = {
  unit_no: string;
  tower_name: string;
  tower_slug: string;
  status: string;
  last_known_rent: number;
  contract_end_date: string;
};

export function generateStaticParams() {
  const supabase = createServerClient();
  const { data: units } = supabase
    .from('vacant_units')
    .select('tower_slug')
    .returns<{ tower_slug: string }[]>();

  // Get unique tower slugs
  const uniqueSlugs = [...new Set(units?.map(unit => unit.tower_slug) || [])];

  return uniqueSlugs.map(slug => ({
    tower: slug
  }));
}

export default function TowerPage({
  params,
}: {
  params: { tower: string };
}) {
  const supabase = createServerClient();
  const { data: units, error } = supabase
    .from('vacant_units')
    .select('*')
    .eq('tower_slug', params.tower)
    .returns<VacantUnit[]>();

  if (error || !units || units.length === 0) {
    notFound();
  }

  const towerName = units[0].tower_name;
  const totalUnits = units.length;
  const vacantUnits = units.filter((unit) => unit.status === 'Vacant').length;
  const rentedUnits = totalUnits - vacantUnits;
  const averageRent = Math.round(
    units.reduce((sum: number, unit: VacantUnit) => sum + (unit.last_known_rent || 0), 0) / totalUnits
  );

  const tower: Tower = {
    name: towerName,
    units: units.map((unit: VacantUnit) => ({
      unit_no: unit.unit_no,
      status: unit.status,
      last_known_rent: unit.last_known_rent,
      contract_end_date: unit.contract_end_date,
    })),
    total_units: totalUnits,
    vacant_units: vacantUnits,
    rented_units: rentedUnits,
    average_rent: averageRent,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{tower.name}</h1>
        <DownloadButton tower={tower} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Units</h3>
          <p className="text-2xl font-bold">{tower.total_units}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Vacant Units</h3>
          <p className="text-2xl font-bold text-red-500">{tower.vacant_units}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Rented Units</h3>
          <p className="text-2xl font-bold text-green-500">{tower.rented_units}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Average Rent</h3>
          <p className="text-2xl font-bold">
            AED {tower.average_rent.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Known Rent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract End Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tower.units.map((unit) => (
                <tr key={unit.unit_no}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {unit.unit_no}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        unit.status === 'Vacant'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {unit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {unit.last_known_rent
                      ? `AED ${unit.last_known_rent.toLocaleString()}`
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {unit.contract_end_date || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}