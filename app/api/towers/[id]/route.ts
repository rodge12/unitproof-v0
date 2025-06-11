import { NextRequest } from 'next/server';
import { dataService } from '@/lib/services/data-service';

type Props = {
  params: {
    id: string;
  };
};

export async function GET(
  request: NextRequest,
  props: Props
) {
  try {
    const tower = await dataService.getTowerBySlug(props.params.id);
    
    if (!tower) {
      return new Response(JSON.stringify({ error: 'Tower not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(tower), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching tower:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
