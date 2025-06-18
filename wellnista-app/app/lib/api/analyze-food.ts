import OpenAI from 'openai';
import { NutritionalInfo } from './image-analyze';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeFoodImage(image: string): Promise<NutritionalInfo | null> {
  try {
    if (!image) {
      throw new Error('No image provided');
    }

    // Remove the data URL prefix to get the base64 string
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a food analysis expert. Analyze the food image and provide nutritional information in Thai and English. If the image is not food, return null. Format your response as a JSON object with the following structure:\n\n{\n  \"product_name\": \"food name in Thai\",\n  \"product_name_en\": \"food name in English\",\n  \"product_name_th\": \"food name in Thai\",\n  \"brands\": \"brand name or 'Unknown'\",\n  \"nutriments\": {\n    \"energy-kcal_serving\": number,\n    \"fat\": number,\n    \"cholesterol\": number,\n    \"carbohydrates\": number,\n    \"sugars_value\": number,\n    \"proteins_serving\": number,\n    \"sodium_value\": number,\n    \"vitamin-a\": number,\n    \"vitamin-b1\": number,\n    \"vitamin-b2\": number,\n    \"calcium\": number,\n    \"iron\": number\n  }\n}\n\nAll numeric values should be numbers, not strings. If a value is unknown, omit it from the response."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image and provide nutritional information if it's food. If it's not food, return null. Your response must be a valid JSON object."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 2048,
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: { type: "json_object" }
    });

    const result = response.choices[0]?.message?.content;
    
    if (!result) {
      return null;
    }

    // Parse the JSON response
    const parsedResult = JSON.parse(result) as NutritionalInfo;
    
    // If the image is not food, return null
    if (!parsedResult.product_name || !parsedResult.product_name_en || !parsedResult.product_name_th) {
      return null;
    }

    // Ensure brands field exists
    if (!parsedResult.brands) {
      parsedResult.brands = "Unknown";
    }

    // Ensure nutriments object exists
    if (!parsedResult.nutriments) {
      parsedResult.nutriments = {};
    }

    return parsedResult;

  } catch (error) {
    console.error('Error analyzing image:', error);
    return null;
  }
} 