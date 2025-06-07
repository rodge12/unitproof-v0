import fs from 'fs';
import path from 'path';

export default async function TowerPage({ params }: { params: { tower: string } }) {
  const filePath = path.join(process.cwd(), 'public/data/vacant-units.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(jsonData);

  const towerData = data.find((t: any) => t.tower_slug === params.tower);

  if (!towerData) {
    return <div className="text-white p-8">No data found for this tower.</div>;
  }

  return (
    <main className="text-white p-8">
      <h1 className="text-3xl font-bold mb-4">{towerData.tower_name}</h1>
     <p><strong>Project:</strong> {unit["Tower Name"]}</p>
     <p><strong>Unit No.:</strong> {unit["Unit No."]}</p>
     <p><strong>Rent:</strong> {unit["Last Known Rent"]} AED</p>
     <p><strong>Days Vacant:</strong> {unit["Days Vacant"] ?? "N/A"}</p>
     <p><strong>Vacancy Status:</strong> {unit["Status"]}</p>
     <p><strong>Last Contract End Date:</strong> {unit["Last Contract End Date"]}</p>
    </main>
  );  
}