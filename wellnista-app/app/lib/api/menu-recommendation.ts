import OpenAI from 'openai';

const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

export interface MenuRecommendation {
  dish_name: string;
  dish_name_en: string;
  description: string;
  description_en: string;
  ingredients: string[];
  cooking_method: string;
  nutritional_info: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sodium: number;
    fiber: number;
  };
  health_benefits: string[];
  dietary_considerations: string[];
  cooking_time: string;
  difficulty: string;
  serving_size: string;
}

export interface MenuRecommendationRequest {
  protein: string;
  diseases: string[];
  language: string;
}

export async function getMenuRecommendation(
  request: MenuRecommendationRequest
): Promise<MenuRecommendation | null> {
  try {
    const { protein, diseases, language } = request;

    // Define language-specific prompts
    const languagePrompts = {
      'th': `คุณเป็นผู้เชี่ยวชาญด้านโภชนาการและอาหารไทย ให้คำแนะนำเมนูอาหารที่เหมาะสมกับผู้ป่วยที่มีโรคประจำตัว

โปรตีนที่เลือก: ${protein}
โรคประจำตัว: ${diseases.join(', ')}

กรุณาแนะนำเมนูอาหารไทยที่:
1. ใช้โปรตีนที่เลือก
2. เหมาะสมกับโรคประจำตัวของผู้ป่วย
3. มีประโยชน์ต่อสุขภาพ
4. ง่ายต่อการทำ

ตอบกลับในรูปแบบ JSON object ตามโครงสร้างนี้:

{
  "dish_name": "ชื่อเมนูภาษาไทย",
  "dish_name_en": "ชื่อเมนูภาษาอังกฤษ",
  "description": "คำอธิบายเมนูภาษาไทย",
  "description_en": "คำอธิบายเมนูภาษาอังกฤษ",
  "ingredients": ["ส่วนผสม1", "ส่วนผสม2", "ส่วนผสม3"],
  "cooking_method": "วิธีการทำอาหาร",
  "nutritional_info": {
    "calories": จำนวนแคลอรี่,
    "protein": จำนวนโปรตีน,
    "carbs": จำนวนคาร์โบไฮเดรต,
    "fat": จำนวนไขมัน,
    "sodium": จำนวนโซเดียม,
    "fiber": จำนวนไฟเบอร์
  },
  "health_benefits": ["ประโยชน์ต่อสุขภาพ1", "ประโยชน์ต่อสุขภาพ2"],
  "dietary_considerations": ["ข้อควรระวัง1", "ข้อควรระวัง2"],
  "cooking_time": "เวลาทำอาหาร",
  "difficulty": "ระดับความยาก",
  "serving_size": "จำนวนที่เสิร์ฟ"
}

หมายเหตุ: จำนวนแคลอรี่ควรเป็นตัวเลข ไม่ใช่สตริง`,

      'en': `You are a nutrition and Thai food expert. Provide menu recommendations suitable for patients with underlying medical conditions.

Selected protein: ${protein}
Medical conditions: ${diseases.join(', ')}

Please recommend a Thai dish that:
1. Uses the selected protein
2. Is suitable for the patient's medical conditions
3. Has health benefits
4. Is easy to prepare

Respond in JSON object format according to this structure:

{
  "dish_name": "Dish name in Thai",
  "dish_name_en": "Dish name in English",
  "description": "Dish description in Thai",
  "description_en": "Dish description in English",
  "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
  "cooking_method": "Cooking method",
  "nutritional_info": {
    "calories": calorie_count,
    "protein": protein_amount,
    "carbs": carbohydrate_amount,
    "fat": fat_amount,
    "sodium": sodium_amount,
    "fiber": fiber_amount
  },
  "health_benefits": ["health benefit1", "health benefit2"],
  "dietary_considerations": ["consideration1", "consideration2"],
  "cooking_time": "Cooking time",
  "difficulty": "Difficulty level",
  "serving_size": "Serving size"
}

Note: Calorie count should be a number, not a string.`,

      'zh': `您是一位营养和泰式美食专家。为有基础疾病的患者提供适合的菜单建议。

选择的蛋白质: ${protein}
疾病状况: ${diseases.join(', ')}

请推荐一道泰式菜肴，要求：
1. 使用选择的蛋白质
2. 适合患者的疾病状况
3. 具有健康益处
4. 易于制作

请按照以下JSON对象格式回复：

{
  "dish_name": "泰语菜名",
  "dish_name_en": "英语菜名",
  "description": "泰语描述",
  "description_en": "英语描述",
  "ingredients": ["配料1", "配料2", "配料3"],
  "cooking_method": "烹饪方法",
  "nutritional_info": {
    "calories": 卡路里数量,
    "protein": 蛋白质含量,
    "carbs": 碳水化合物含量,
    "fat": 脂肪含量,
    "sodium": 钠含量,
    "fiber": 纤维含量
  },
  "health_benefits": ["健康益处1", "健康益处2"],
  "dietary_considerations": ["注意事项1", "注意事项2"],
  "cooking_time": "烹饪时间",
  "difficulty": "难度等级",
  "serving_size": "份量"
}

注意：卡路里数量应为数字，不是字符串。`,

      'ja': `あなたは栄養とタイ料理の専門家です。基礎疾患のある患者に適したメニューを提案してください。

選択されたタンパク質: ${protein}
疾患: ${diseases.join(', ')}

以下の条件を満たすタイ料理を推奨してください：
1. 選択されたタンパク質を使用
2. 患者の疾患に適している
3. 健康に良い
4. 作りやすい

以下のJSONオブジェクト形式で回答してください：

{
  "dish_name": "タイ語の料理名",
  "dish_name_en": "英語の料理名",
  "description": "タイ語の説明",
  "description_en": "英語の説明",
  "ingredients": ["材料1", "材料2", "材料3"],
  "cooking_method": "調理方法",
  "nutritional_info": {
    "calories": カロリー数,
    "protein": タンパク質量,
    "carbs": 炭水化物量,
    "fat": 脂質量,
    "sodium": ナトリウム量,
    "fiber": 食物繊維量
  },
  "health_benefits": ["健康効果1", "健康効果2"],
  "dietary_considerations": ["注意事項1", "注意事項2"],
  "cooking_time": "調理時間",
  "difficulty": "難易度",
  "serving_size": "盛り付け量"
}

注意：カロリー数は数字で、文字列ではありません。`,

      'ko': `당신은 영양과 태국 요리 전문가입니다. 기저질환이 있는 환자에게 적합한 메뉴를 추천해 주세요.

선택된 단백질: ${protein}
질환: ${diseases.join(', ')}

다음 조건을 만족하는 태국 요리를 추천해 주세요:
1. 선택된 단백질 사용
2. 환자의 질환에 적합
3. 건강에 좋음
4. 만들기 쉬움

다음 JSON 객체 형식으로 답변해 주세요:

{
  "dish_name": "태국어 요리명",
  "dish_name_en": "영어 요리명",
  "description": "태국어 설명",
  "description_en": "영어 설명",
  "ingredients": ["재료1", "재료2", "재료3"],
  "cooking_method": "조리 방법",
  "nutritional_info": {
    "calories": 칼로리 수,
    "protein": 단백질량,
    "carbs": 탄수화물량,
    "fat": 지방량,
    "sodium": 나트륨량,
    "fiber": 식이섬유량
  },
  "health_benefits": ["건강 효과1", "건강 효과2"],
  "dietary_considerations": ["주의사항1", "주의사항2"],
  "cooking_time": "조리 시간",
  "difficulty": "난이도",
  "serving_size": "1인분량"
}

참고: 칼로리 수는 숫자여야 하며, 문자열이 아닙니다.`,

      'id': `Anda adalah ahli gizi dan makanan Thailand. Berikan rekomendasi menu yang cocok untuk pasien dengan kondisi medis yang mendasarinya.

Protein yang dipilih: ${protein}
Kondisi medis: ${diseases.join(', ')}

Silakan rekomendasikan hidangan Thailand yang:
1. Menggunakan protein yang dipilih
2. Cocok untuk kondisi medis pasien
3. Memiliki manfaat kesehatan
4. Mudah disiapkan

Jawab dalam format objek JSON sesuai struktur ini:

{
  "dish_name": "Nama hidangan dalam bahasa Thailand",
  "dish_name_en": "Nama hidangan dalam bahasa Inggris",
  "description": "Deskripsi hidangan dalam bahasa Thailand",
  "description_en": "Deskripsi hidangan dalam bahasa Inggris",
  "ingredients": ["bahan1", "bahan2", "bahan3"],
  "cooking_method": "Metode memasak",
  "nutritional_info": {
    "calories": jumlah_kalori,
    "protein": jumlah_protein,
    "carbs": jumlah_karbohidrat,
    "fat": jumlah_lemak,
    "sodium": jumlah_natrium,
    "fiber": jumlah_serat
  },
  "health_benefits": ["manfaat_kesehatan1", "manfaat_kesehatan2"],
  "dietary_considerations": ["pertimbangan1", "pertimbangan2"],
  "cooking_time": "Waktu memasak",
  "difficulty": "Tingkat kesulitan",
  "serving_size": "Ukuran porsi"
}

Catatan: Jumlah kalori harus berupa angka, bukan string.`
    };

    // Get the appropriate prompt for the selected language
    const systemPrompt = languagePrompts[language as keyof typeof languagePrompts] || languagePrompts['th'];

    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: "Please provide a menu recommendation based on the protein choice and medical conditions."
        }
      ],
      max_tokens: 2048,
      temperature: 0.7,
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
    const parsedResult = JSON.parse(result) as MenuRecommendation;
    
    // Validate the response
    if (!parsedResult.dish_name || !parsedResult.dish_name_en) {
      return null;
    }

    return parsedResult;

  } catch (error) {
    console.error('Error getting menu recommendation:', error);
    return null;
  }
}
