import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { TowerGrid } from "@/components/towers/tower-grid"
import { ReviewsSection } from "@/components/reviews-section"
import { LeadForm } from "@/components/forms/lead-form"
import { Footer } from "@/components/footer"
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { createSlug } from '@/utils/slug';
import { TowerList } from '@/components/tower-list';
import { Suspense } from 'react';
import { TowerListRealtime } from '@/components/tower-list-realtime';
import { createServerClient } from '@/utils/supabase/server';

type TowerData = {
  tower_name: string;
  unit_no: string;
};

type TowerCounts = Record<string, number>;

type ProcessedTower = {
  name: string;
  vacantUnits: number;
};

type Tower = {
  name: string;
  slug: string;
  vacant_units: number;
};

async function TowerListLoader() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Fetch all unique tower names and their vacant unit counts
  const { data: towers, error } = await supabase
    .from('vacant_units')
    .select('tower_name, unit_no')
    .order('tower_name');

  if (error) {
    console.error('Error fetching towers:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Error Loading Towers</h1>
        <p className="text-red-500">Failed to load tower data. Please try again later.</p>
      </div>
    );
  }

  // Process the data to get unique towers with vacant unit counts
  const towerCounts = (towers as TowerData[]).reduce((acc: TowerCounts, { tower_name }: { tower_name: string }) => {
    acc[tower_name] = (acc[tower_name] || 0) + 1;
    return acc;
  }, {});

  const towerData: ProcessedTower[] = Object.entries(towerCounts).map(([name, vacantUnits]) => ({
    name,
    vacantUnits
  }));

  return <TowerList towers={towerData} />;
}

export const dynamic = 'force-dynamic';

// Home page component - displays the main landing page with tower listings
export default async function Home() {
  const supabase = createServerClient();
  
  // Fetch all units with their tower information
  const { data: units, error } = await supabase
    .from('vacant_units')
    .select('tower_name, tower_slug, unit_no');

  if (error) {
    console.error('Error fetching units:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dubai Vacant Units</h1>
        <p className="text-red-500">Error loading towers. Please try again later.</p>
      </div>
    );
  }

  // Group units by tower
  const towers = units?.reduce((acc: Record<string, Tower>, unit) => {
    const towerName = unit.tower_name;
    if (!acc[towerName]) {
      acc[towerName] = {
        name: towerName,
        slug: unit.tower_slug,
        vacant_units: 0
      };
    }
    acc[towerName].vacant_units++;
    return acc;
  }, {});

  // Convert to array and sort by name
  const towerList = Object.values(towers || {}).sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  // Debug log
  console.log('All towers:', towerList);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <HeroSection />

      {/* Tower Grid Section */}
      <section id="towers-section">
        <TowerGrid />
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Lead Generation Section */}
      <section id="lead-form-section" className="py-20 px-4 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Your Free Vacancy Report</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Access detailed vacancy data, rental insights, and market opportunities. Our comprehensive reports help
              you make informed real estate decisions and close more deals.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <LeadForm />
          </div>
        </div>
      </section>

      <Footer />

      <main className="p-4 md:p-8 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Tower Directory</h1>
          
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Available Towers</h2>
              <TowerListRealtime />
            </div>
          </div>

          <div className="mt-8 text-gray-400 text-sm">
            <p>Total Towers: {towerList.length}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
