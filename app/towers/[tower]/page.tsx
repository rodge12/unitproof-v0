import { notFound } from "next/navigation";
import vacantUnits from "@/data/vacant-units.json";

export default function TowerPage({ params }: { params: { tower: string } }) {
  const towerName = decodeURIComponent(params.tower);

  const units = vacantUnits.filter(
    (unit) => unit["Tower Name"].toLowerCase() === towerName.toLowerCase()
  );

  if (units.length === 0) return notFound();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">{towerName}</h1>
      <div className="space-y-4">
        {units.map((unit, index) => (
          <div key={index} className="border p-4 rounded bg-gray-900 text-white">
            <p><strong>Unit No:</strong> {unit["Unit No"]}</p>
            <p><strong>Status:</strong> {unit["Status"]}</p>
            <p><strong>Days Vacant:</strong> {unit["Days Vacant"]}</p>
            <p><strong>Last Contract End:</strong> {unit["Last Contract End"]}</p>
          </div>
        ))}
      </div>
    </main>
  );
}