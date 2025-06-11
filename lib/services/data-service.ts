import { Tower, Unit, TowerWithUnits } from '@/types';
import towersData from '@/public/data/dubai_towers_300.json';

// Helper function to generate slug from tower name
const generateSlug = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

// Helper function to generate random date within last year
const getRandomDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 365));
  return date.toISOString().split('T')[0];
};

// Helper function to generate random unit number
const generateUnitNumber = (): string => {
  const floor = Math.floor(Math.random() * 50) + 1;
  const unit = Math.floor(Math.random() * 10) + 1;
  return `${floor}${unit.toString().padStart(2, '0')}`;
};

// Generate mock units for a tower
const generateMockUnits = (towerName: string): Unit[] => {
  const units: Unit[] = [];
  const numUnits = Math.floor(Math.random() * 20) + 10; // 10-30 units per tower

  for (let i = 0; i < numUnits; i++) {
    const daysVacant = Math.floor(Math.random() * 365);
    const status = daysVacant > 180 
      ? 'Long Vacant' 
      : ['Vacant', 'Tenanted', 'For Sale'][Math.floor(Math.random() * 3)] as Unit['status'];

    units.push({
      id: `${towerName}-${i}`,
      unit_number: generateUnitNumber(),
      contract_end_date: getRandomDate(),
      days_vacant: daysVacant,
      last_known_rent: Math.floor(Math.random() * 50000) + 30000,
      status
    });
  }

  return units;
};

// Process towers data
const processTowers = (): Tower[] => {
  return towersData.map(tower => ({
    ...tower,
    slug: generateSlug(tower.name),
    total_units: Math.floor(Math.random() * 200) + 100,
    vacant_units: Math.floor(Math.random() * 50) + 10,
    average_rent: Math.floor(Math.random() * 50000) + 30000
  }));
};

// Cache processed towers
let processedTowers: Tower[] | null = null;

export const dataService = {
  getAllTowers: (): Tower[] => {
    if (!processedTowers) {
      processedTowers = processTowers();
    }
    return processedTowers.sort((a, b) => a.name.localeCompare(b.name));
  },

  getTowerBySlug: (slug: string): TowerWithUnits | null => {
    if (!processedTowers) {
      processedTowers = processTowers();
    }
    
    const tower = processedTowers.find(t => t.slug === slug);
    if (!tower) return null;

    return {
      ...tower,
      units: generateMockUnits(tower.name)
    };
  }
};
