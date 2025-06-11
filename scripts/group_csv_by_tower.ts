import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Types
type CSVRow = {
  'Tower Name': string;
  'Unit No.': string;
  'Status': string;
  'Last Contract End Date': string;
  'Days Vacant': string;
  'Last Known Rent': string;
  'Sale Date (if any)': string;
};

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

// Function to create a slug from a string
function createSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Function to parse numeric values
function parseNumeric(value: string): number | null {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

// Main function to process the CSV file
function processCSV(): void {
  try {
    // Read and parse CSV file
    const csvFilePath = path.join(__dirname, '../public/data/Final_Vacant_Units.csv');
    const jsonFilePath = path.join(__dirname, '../public/data/vacant-units.json');
    
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    }) as CSVRow[];

    // Group by tower
    const towers: { [key: string]: Tower } = {};

    records.forEach(record => {
      const towerName = record['Tower Name'];
      if (!towerName) {
        console.warn('Skipping record with no tower name:', record);
        return;
      }

      const slug = createSlug(towerName);
      
      if (!towers[slug]) {
        towers[slug] = {
          tower: towerName,
          slug: slug,
          units: []
        };
      }

      // Create unit object
      const unit: Unit = {
        unit: record['Unit No.'],
        status: record['Status'],
        lastContractEndDate: record['Last Contract End Date'],
        daysVacant: parseNumeric(record['Days Vacant']),
        rent: parseNumeric(record['Last Known Rent'])
      };

      towers[slug].units.push(unit);
    });

    // Convert to array and sort by tower name
    const towersArray = Object.values(towers).sort((a, b) => 
      a.tower.localeCompare(b.tower)
    );

    // Write to JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(towersArray, null, 2));

    // Print summary
    console.log('Successfully processed CSV and created JSON file');
    console.log(`Processed ${records.length} units across ${towersArray.length} towers`);
    
    // Print tower summary
    towersArray.forEach(tower => {
      console.log(`- ${tower.tower}: ${tower.units.length} units`);
    });

  } catch (error) {
    console.error('Error processing file:', error);
    process.exit(1);
  }
}

// Run the script
processCSV(); 