import data from '@/public/data/vacant-units.json';

type Unit = {
  'Tower Name': string;
  'Unit No.': string;
  'Last Known Rent': number;
  'Days Vacant': number | null;
  'tower_slug': string;
};

export default function TowerPage({ params }: { params: { tower: string } }) {
  const units: Unit[] = data as Unit[];
  const filtered = units.filter((unit) => unit.tower_slug === params.tower);

  if (filtered.length === 0) {
    return <div className="p-8 text-white">No data found for this tower.</div>;
  }

  return (
    <main className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">
        Units in {filtered[0]['Tower Name']}
      </h1>
      <ul className="space-y-4">
        {filtered.map((unit) => (
          <li key={unit['Unit No.']} className="border p-4 rounded">
            <p><strong>Project:</strong> {unit['Tower Name']}</p>
            <p><strong>Unit:</strong> {unit['Unit No.']}</p>
            <p><strong>Rent:</strong> AED {unit['Last Known Rent'].toLocaleString()}</p>
            <p><strong>Days Vacant:</strong> {unit['Days Vacant'] ?? '—'}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}