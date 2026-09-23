import OpenAI from 'openai';
import { NutritionalInfo } from './image-analyze';

// Thrown for anything that is NOT "the picture is not food": missing config,
// an OpenAI/API failure, or an unparseable model reply. The route turns this
// into an error response so the app can say "cannot analyze" (with the real
// reason in the logs) instead of the misleading "no food found in image".
export class FoodAnalysisError extends Error {
  code: 'not_configured' | 'openai_error' | 'bad_response';
  status: number;

  constructor(code: FoodAnalysisError['code'], message: string, status = 502) {
    super(message);
    this.name = 'FoodAnalysisError';
    this.code = code;
    this.status = status;
  }
}

const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new FoodAnalysisError('not_configured', 'OPENAI_API_KEY is not configured', 500);
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

// Vision-capable chat model. Overridable without a deploy so a retired model
// name can be swapped from the environment.
const MODEL = process.env.OPENAI_FOOD_MODEL || 'gpt-4o';

const LANGUAGE_NAMES: Record<string, string> = {
  th: 'Thai',
  en: 'English',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  id: 'Indonesian',
};

function systemPrompt(language: string): string {
  const name = LANGUAGE_NAMES[language] || LANGUAGE_NAMES.th;
  return (
    `You are a food analysis expert. Analyze the food image and provide nutritional information in ${name}. ` +
    `If the image is not food, respond with exactly {"food": false}. ` +
    `Otherwise respond with a JSON object with the following structure:\n\n` +
    `{\n  "food": true,\n  "product_name": "food name in ${name}",\n  "product_name_en": "food name in English",\n` +
    `  "product_name_th": "food name in Thai",\n  "brands": "brand name or 'Unknown'",\n  "nutriments": {\n` +
    `    "energy-kcal_serving": number,\n    "fat": number,\n    "cholesterol": number,\n    "carbohydrates": number,\n` +
    `    "sugars_value": number,\n    "proteins_serving": number,\n    "sodium_value": number,\n    "vitamin-a": number,\n` +
    `    "vitamin-b1": number,\n    "vitamin-b2": number,\n    "calcium": number,\n    "iron": number\n  }\n}\n\n` +
    `Estimate values for one typical serving. All numeric values should be numbers, not strings. ` +
    `If a value is unknown, omit it from the response.`
  );
}

// Turns the model's JSON text into a NutritionalInfo, or null when the model
// says the picture is not food. Throws FoodAnalysisError on malformed output.
export function parseFoodAnalysis(content: string | null | undefined): NutritionalInfo | null {
  if (!content || !content.trim()) {
    throw new FoodAnalysisError('bad_response', 'Empty response from the model');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new FoodAnalysisError('bad_response', 'Model response was not valid JSON');
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    // The prompt asks for {"food": false}; an older-style bare null means the same.
    return null;
  }

  const obj = parsed as Record<string, unknown>;
  if (obj.food === false || obj.result === null) return null;

  const name = (key: string) => (typeof obj[key] === 'string' ? (obj[key] as string).trim() : '');
  const productName = name('product_name') || name('product_name_en') || name('product_name_th');
  if (!productName) return null;

  const nutriments =
    obj.nutriments && typeof obj.nutriments === 'object' && !Array.isArray(obj.nutriments)
      ? (obj.nutriments as NutritionalInfo['nutriments'])
      : {};

  return {
    ...obj,
    product_name: productName,
    product_name_en: name('product_name_en') || productName,
    product_name_th: name('product_name_th') || productName,
    brands: name('brands') || 'Unknown',
    nutriments,
  } as NutritionalInfo;
}

// Resolves to the nutrition estimate, or null when the picture is not food.
// Rejects with FoodAnalysisError for configuration / API / parsing failures.
export async function analyzeFoodImage(image: string, language: string = 'th'): Promise<NutritionalInfo | null> {
  if (!image) {
    throw new FoodAnalysisError('bad_response', 'No image provided', 400);
  }

  // Keep the real MIME type: the camera sends JPEG, but a PNG relabelled as
  // JPEG is rejected by the API.
  const header = /^data:(image\/[\w+.-]+);base64,/.exec(image);
  const mime = header?.[1] || 'image/jpeg';
  const base64Image = image.replace(/^data:image\/[\w+.-]+;base64,/, '');

  const openai = getOpenAI();

  let content: string | null | undefined;
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt(language) },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this image and provide nutritional information if it is food. Your response must be a valid JSON object.',
            },
            {
              type: 'image_url',
              image_url: { url: `data:${mime};base64,${base64Image}` },
            },
          ],
        },
      ],
      max_tokens: 2048,
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });
    content = response.choices[0]?.message?.content;
  } catch (error) {
    const err = error as { status?: number; code?: string; message?: string };
    const status = typeof err.status === 'number' && err.status >= 400 ? err.status : 502;
    throw new FoodAnalysisError(
      'openai_error',
      `OpenAI request failed${err.code ? ` (${err.code})` : ''}: ${err.message || String(error)}`,
      status
    );
  }

  return parseFoodAnalysis(content);
}
