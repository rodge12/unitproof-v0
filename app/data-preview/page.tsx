import data from '@/public/data/vacant-units.json';
import { DataPreview } from './DataPreview';

export default function DataPreviewPage() {
  return (
    <main className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Data Preview</h1>
      <DataPreview initialData={data} />
    </main>
  );
} 