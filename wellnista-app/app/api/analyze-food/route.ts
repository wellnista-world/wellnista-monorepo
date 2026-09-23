import { NextResponse } from 'next/server';
import { analyzeFoodImage, FoodAnalysisError } from '../../lib/api/analyze-food';

// POST /api/analyze-food  { image: dataUrl, language }
//
// 200 with the nutrition object, or 200 `null` when the picture is not food.
// Anything else (no API key, OpenAI error such as insufficient_quota, model
// reply unparseable) is an error response with a machine-readable `code`, so
// the app can tell "not food" apart from "the analyzer is broken".
export async function POST(request: Request) {
  try {
    const { image, language = 'th' } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided', code: 'bad_request' },
        { status: 400 }
      );
    }

    const result = await analyzeFoodImage(image, language);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof FoodAnalysisError) {
      console.error(`Food analysis failed [${error.code}]:`, error.message);
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image', code: 'server_error' },
      { status: 500 }
    );
  }
}
