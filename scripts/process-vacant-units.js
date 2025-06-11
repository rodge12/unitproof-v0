const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

// Function to create a slug from a string
function createSlug(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Function to process CSV file and generate JSON
function processVacantUnits(csvFilePath, jsonFilePath) {
    try {
        // Read the CSV file
        const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
        
        // Parse CSV content
        const records = csv.parse(fileContent, {
            columns: true,
            skip_empty_lines: true
        });

        // Group units by tower
        const towers = {};
        
        records.forEach(record => {
            const towerName = record['Tower Name'];
            if (!towerName) {
                console.warn('Skipping record with no tower name:', record);
                return;
            }

            const slug = createSlug(towerName);
            
            if (!towers[slug]) {
                towers[slug] = {
                    name: towerName,
                    slug: slug,
                    units: []
                };
            }

            // Create unit object
            const unit = {
                unitNo: record['Unit No.'],
                status: record['Status'],
                lastContractEndDate: record['Last Contract End Date'],
                daysVacant: record['Days Vacant'] ? parseFloat(record['Days Vacant']) : null,
                lastKnownRent: record['Last Known Rent'] ? parseFloat(record['Last Known Rent']) : null,
                saleDate: record['Sale Date (if any)'] || null
            };

            towers[slug].units.push(unit);
        });

        // Convert to array format
        const towersArray = Object.values(towers);

        // Write to JSON file
        fs.writeFileSync(jsonFilePath, JSON.stringify(towersArray, null, 2));
        
        console.log('Successfully processed CSV and created JSON file');
        console.log(`Processed ${records.length} units across ${towersArray.length} towers`);
        
        // Print summary of towers
        towersArray.forEach(tower => {
            console.log(`- ${tower.name}: ${tower.units.length} units`);
        });

    } catch (error) {
        console.error('Error processing file:', error);
        process.exit(1);
    }
}

// Get command line arguments
const args = process.argv.slice(2);
const csvFilePath = args[0] || path.join(__dirname, '../public/data/Final_Vacant_Units (1).csv');
const jsonFilePath = args[1] || path.join(__dirname, '../public/data/vacant-units.json');

// Process the files
console.log(`Processing CSV file: ${csvFilePath}`);
console.log(`Output JSON file: ${jsonFilePath}`);
processVacantUnits(csvFilePath, jsonFilePath); 