import { NextResponse } from 'next/server';
import { getMenuRecommendation } from '../../lib/api/menu-recommendation';

export async function POST(request: Request) {
  try {
    const { protein, diseases, language = 'th' } = await request.json();

    if (!protein || !diseases || !Array.isArray(diseases)) {
      return NextResponse.json(
        { error: 'Invalid request data. Protein and diseases array are required.' },
        { status: 400 }
      );
    }

    const result = await getMenuRecommendation({
      protein,
      diseases,
      language
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to generate menu recommendation' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in menu recommendation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
