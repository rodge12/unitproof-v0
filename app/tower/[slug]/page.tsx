import { notFound } from 'next/navigation';
import { dataService } from '@/lib/services/data-service';
import { UnitCard } from '@/components/towers/unit-card';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

interface TowerPageProps {
  params: {
    slug: string;
  };
}

export default function TowerPage({ params }: TowerPageProps) {
  const tower = dataService.getTowerBySlug(params.slug);

  if (!tower) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{tower.name}</h1>
          <p className="text-gray-600 mt-2">{tower.area}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500">Total Units</p>
            <p className="text-2xl font-semibold">{tower.total_units}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500">Vacant Units</p>
            <p className="text-2xl font-semibold text-green-600">{tower.vacant_units}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500">Average Rent</p>
            <p className="text-2xl font-semibold">AED {tower.average_rent.toLocaleString()}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Units</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tower.units.map((unit) => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
} 