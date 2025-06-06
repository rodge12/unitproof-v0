import data from '@/public/data/vacant-units.json';

type Props = {
  params: {
    tower: string;
  };
};

export default function TowerPage({ params }: Props) {
  const { tower } = params;

  // Match tower name with the URL
  const towerData = data.filter(
    (unit: any) =>
      unit.tower_name.toLowerCase().replace(/\s+/g, '-') === tower.toLowerCase()
  );

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold capitalize">{tower.replace(/-/g, ' ')}</h1>
      <p className="mt-2 text-gray-400">{towerData.length} units found</p>

      <ul className="mt-6 space-y-2">
        {towerData.map((unit: any, index: number) => (
          <li key={index} className="bg-gray-800 p-4 rounded shadow">
            <p><strong>Unit No:</strong> {unit.unit_number}</p>
            <p><strong>Status:</strong> {unit.status}</p>
            <p><strong>Contract End:</strong> {unit.contract_end}</p>
            <p><strong>Days Vacant:</strong> {unit.days_vacant}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}