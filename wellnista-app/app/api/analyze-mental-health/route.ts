import { NextResponse } from 'next/server';
import { analyzeMentalHealth } from '../../lib/api/analyze-mental-health';

export async function POST(request: Request) {
  try {
    const { transcript, language = 'th' } = await request.json();

    if (!transcript || transcript.trim().length < 10) {
      return NextResponse.json(
        { error: 'Transcript too short for analysis. Please provide at least 10 characters.' },
        { status: 400 }
      );
    }

    const result = await analyzeMentalHealth(transcript, language);

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to analyze mental health transcript' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in mental health analysis API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
