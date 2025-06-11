import { dataService } from '@/lib/services/data-service';
import { TowerCard } from '@/components/towers/tower-card';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  const towers = dataService.getAllTowers();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dubai Property Intelligence</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {towers.map((tower) => (
            <TowerCard key={tower.slug} tower={tower} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
