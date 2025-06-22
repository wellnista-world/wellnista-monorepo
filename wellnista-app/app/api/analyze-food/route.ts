import { NextResponse } from 'next/server';
import { analyzeFoodImage } from '../../lib/api/analyze-food';

export async function POST(request: Request) {
  try {
    const { image, language = 'th' } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    const result = await analyzeFoodImage(image, language);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
} 