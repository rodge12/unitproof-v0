import { Unit } from '@/types';

interface UnitCardProps {
  unit: Unit;
}

const getStatusColor = (status: Unit['status']) => {
  switch (status) {
    case 'Vacant':
      return 'bg-green-100 text-green-800';
    case 'Tenanted':
      return 'bg-gray-100 text-gray-800';
    case 'For Sale':
      return 'bg-blue-100 text-blue-800';
    case 'Long Vacant':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function UnitCard({ unit }: UnitCardProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-gray-900">Unit {unit.unit_number}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(unit.status)}`}>
          {unit.status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Contract End</p>
          <p className="font-medium">{new Date(unit.contract_end_date).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Days Vacant</p>
          <p className="font-medium">{unit.days_vacant}</p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-500">Last Known Rent</p>
          <p className="font-medium">AED {unit.last_known_rent.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
} 