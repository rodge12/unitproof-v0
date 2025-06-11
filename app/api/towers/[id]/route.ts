import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/services/data-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tower = dataService.getTowerBySlug(params.id);

    if (!tower) {
      return NextResponse.json({ error: 'Tower not found' }, { status: 404 });
    }

    return NextResponse.json(tower);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
