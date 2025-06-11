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

export async function generateStaticParams() {
  try {
    const supabase = createServerClient();
    const { data: units } = await supabase
      .from('vacant_units')
      .select('tower_slug')
      .distinct();

    return units?.map((unit) => ({
      tower: unit.tower_slug,
    })) || [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return []; // Return empty array if there's an error during static generation
  }
}

export default async function TowerPage({
  params,
}: {
  params: { tower: string };
}) {
  const supabase = createServerClient();
  const { data: units, error } = await supabase
    .from('vacant_units')
    .select('*')
    .eq('tower_slug', params.tower);

  if (error || !units || units.length === 0) {
    notFound();
  }

  // Calculate summary statistics
  const total_units = units.length;
  const vacant_units = units.filter(unit => unit.status === 'Vacant').length;
  const rented_units = total_units - vacant_units;
  const average_rent = Math.round(
    units.reduce((sum, unit) => sum + (unit.last_known_rent || 0), 0) / total_units
  );

  const tower: Tower = {
    name: units[0].tower_name,
    units: units.map(unit => ({
      unit_no: unit.unit_no,
      status: unit.status,
      last_known_rent: unit.last_known_rent,
      contract_end_date: unit.contract_end_date,
    })),
    total_units,
    vacant_units,
    rented_units,
    average_rent,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{tower.name}</h1>
        <DownloadButton units={tower.units} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Units</h3>
          <p className="text-2xl font-semibold">{tower.total_units}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Vacant Units</h3>
          <p className="text-2xl font-semibold text-blue-600">{tower.vacant_units}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Rented Units</h3>
          <p className="text-2xl font-semibold text-green-600">{tower.rented_units}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Average Rent</h3>
          <p className="text-2xl font-semibold">
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
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        unit.status === 'Vacant'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
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