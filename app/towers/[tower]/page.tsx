import data from '@/public/data/vacant-units.json';
import { DownloadButton } from './DownloadButton';

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

export default function TowerPage({ params }: { params: { tower: string } }) {
  const tower = (data as Tower[]).find((t) => t.slug === params.tower);

  if (!tower) {
    return (
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold mb-4">No data found for this tower.</h1>
        <p>The requested tower could not be found in our database.</p>
      </div>
    );
  }

  return (
    <main className="p-4 md:p-8 text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">{tower.tower}</h1>
        <DownloadButton tower={tower} />
      </div>
      <div className="grid gap-4 md:gap-6">
        {tower.units.map((unit) => (
          <div
            key={unit.unit}
            className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="p-4 md:p-6">
              {/* Unit Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 pb-4 border-b border-gray-700">
                <h3 className="text-lg md:text-xl font-semibold">Unit {unit.unit}</h3>
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
                    <p className="text-gray-200">{unit.lastContractEndDate || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">Days Vacant</p>
                    <p className="text-gray-200">
                      {unit.daysVacant ? `${unit.daysVacant} days` : '—'}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">Last Known Rent</p>
                    <p className="text-gray-200">
                      {unit.rent ? `AED ${unit.rent.toLocaleString()}` : '—'}
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