import OpenAI from 'openai';

const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

export interface MentalHealthAnalysis {
  mental_score: number;
  mood_category: string;
  stress_level: number;
  anxiety_level: number;
  depression_level: number;
  summary: string;
  recommendations: string[];
}

export async function analyzeMentalHealth(
  transcript: string, 
  language: string = 'th'
): Promise<MentalHealthAnalysis | null> {
  try {
    if (!transcript || transcript.trim().length < 10) {
      throw new Error('Transcript too short for analysis');
    }

    // Define language-specific prompts
    const languagePrompts = {
      'th': `คุณเป็นผู้เชี่ยวชาญด้านสุขภาพจิตและจิตวิทยา วิเคราะห์ข้อความที่ผู้ใช้พูดเพื่อประเมินสุขภาพจิต

ข้อความของผู้ใช้: "${transcript}"

กรุณาวิเคราะห์และให้คะแนนสุขภาพจิตตามเกณฑ์ต่อไปนี้:

1. คะแนนสุขภาพจิตโดยรวม (0-100)
2. หมวดหมู่อารมณ์ (excellent, good, fair, poor, critical)
3. ระดับความเครียด (0-100)
4. ระดับความวิตกกังวล (0-100)
5. ระดับความซึมเศร้า (0-100)
6. สรุปสถานะสุขภาพจิต
7. คำแนะนำสำหรับการปรับปรุง

ตอบกลับในรูปแบบ JSON object ตามโครงสร้างนี้:

{
  "mental_score": จำนวนคะแนนสุขภาพจิต (0-100),
  "mood_category": "หมวดหมู่อารมณ์ (excellent/good/fair/poor/critical)",
  "stress_level": ระดับความเครียด (0-100),
  "anxiety_level": ระดับความวิตกกังวล (0-100),
  "depression_level": ระดับความซึมเศร้า (0-100),
  "summary": "สรุปสถานะสุขภาพจิตเป็นภาษาไทย",
  "recommendations": ["คำแนะนำ1", "คำแนะนำ2", "คำแนะนำ3"]
}

หมายเหตุ: ตัวเลขทั้งหมดต้องเป็นตัวเลข ไม่ใช่สตริง`,

      'en': `You are a mental health and psychology expert. Analyze the user's spoken text to assess their mental health.

User's text: "${transcript}"

Please analyze and score mental health according to the following criteria:

1. Overall mental health score (0-100)
2. Mood category (excellent, good, fair, poor, critical)
3. Stress level (0-100)
4. Anxiety level (0-100)
5. Depression level (0-100)
6. Summary of mental health status
7. Recommendations for improvement

Respond in JSON object format according to this structure:

{
  "mental_score": mental_health_score (0-100),
  "mood_category": "mood_category (excellent/good/fair/poor/critical)",
  "stress_level": stress_level (0-100),
  "anxiety_level": anxiety_level (0-100),
  "depression_level": depression_level (0-100),
  "summary": "summary_of_mental_health_status_in_English",
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}

Note: All numbers should be numbers, not strings.`,

      'ko': `당신은 정신건강과 심리학 전문가입니다. 사용자가 말한 텍스트를 분석하여 정신건강을 평가해주세요.

사용자의 텍스트: "${transcript}"

다음 기준에 따라 정신건강을 분석하고 점수를 매겨주세요:

1. 전체 정신건강 점수 (0-100)
2. 기분 카테고리 (excellent, good, fair, poor, critical)
3. 스트레스 수준 (0-100)
4. 불안 수준 (0-100)
5. 우울 수준 (0-100)
6. 정신건강 상태 요약
7. 개선을 위한 권장사항

다음 JSON 객체 형식으로 답변해주세요:

{
  "mental_score": 정신건강_점수 (0-100),
  "mood_category": "기분_카테고리 (excellent/good/fair/poor/critical)",
  "stress_level": 스트레스_수준 (0-100),
  "anxiety_level": 불안_수준 (0-100),
  "depression_level": 우울_수준 (0-100),
  "summary": "한국어로_정신건강_상태_요약",
  "recommendations": ["권장사항1", "권장사항2", "권장사항3"]
}

참고: 모든 숫자는 숫자여야 하며, 문자열이 아닙니다.`,

      'zh': `您是一位心理健康和心理学专家。分析用户的口语文本以评估他们的心理健康。

用户的文本: "${transcript}"

请根据以下标准分析并评分心理健康：

1. 整体心理健康分数 (0-100)
2. 情绪类别 (excellent, good, fair, poor, critical)
3. 压力水平 (0-100)
4. 焦虑水平 (0-100)
5. 抑郁水平 (0-100)
6. 心理健康状态总结
7. 改善建议

请按照以下JSON对象格式回复：

{
  "mental_score": 心理健康分数 (0-100),
  "mood_category": "情绪类别 (excellent/good/fair/poor/critical)",
  "stress_level": 压力水平 (0-100),
  "anxiety_level": 焦虑水平 (0-100),
  "depression_level": 抑郁水平 (0-100),
  "summary": "用中文总结心理健康状态",
  "recommendations": ["建议1", "建议2", "建议3"]
}

注意：所有数字都应该是数字，不是字符串。`,

      'ja': `あなたはメンタルヘルスと心理学の専門家です。ユーザーの話したテキストを分析して、メンタルヘルスを評価してください。

ユーザーのテキスト: "${transcript}"

以下の基準に従ってメンタルヘルスを分析し、スコアを付けてください：

1. 全体的なメンタルヘルススコア (0-100)
2. 気分カテゴリ (excellent, good, fair, poor, critical)
3. ストレスレベル (0-100)
4. 不安レベル (0-100)
5. うつレベル (0-100)
6. メンタルヘルス状態の要約
7. 改善のための推奨事項

以下のJSONオブジェクト形式で回答してください：

{
  "mental_score": メンタルヘルススコア (0-100),
  "mood_category": "気分カテゴリ (excellent/good/fair/poor/critical)",
  "stress_level": ストレスレベル (0-100),
  "anxiety_level": 不安レベル (0-100),
  "depression_level": うつレベル (0-100),
  "summary": "日本語でメンタルヘルス状態を要約",
  "recommendations": ["推奨事項1", "推奨事項2", "推奨事項3"]
}

注意：すべての数字は数字である必要があり、文字列ではありません。`,

      'id': `Anda adalah ahli kesehatan mental dan psikologi. Analisis teks yang diucapkan pengguna untuk menilai kesehatan mental mereka.

Teks pengguna: "${transcript}"

Silakan analisis dan berikan skor kesehatan mental menurut kriteria berikut:

1. Skor kesehatan mental keseluruhan (0-100)
2. Kategori suasana hati (excellent, good, fair, poor, critical)
3. Tingkat stres (0-100)
4. Tingkat kecemasan (0-100)
5. Tingkat depresi (0-100)
6. Ringkasan status kesehatan mental
7. Rekomendasi untuk perbaikan

Jawab dalam format objek JSON sesuai struktur ini:

{
  "mental_score": skor_kesehatan_mental (0-100),
  "mood_category": "kategori_suasana_hati (excellent/good/fair/poor/critical)",
  "stress_level": tingkat_stres (0-100),
  "anxiety_level": tingkat_kecemasan (0-100),
  "depression_level": tingkat_depresi (0-100),
  "summary": "ringkasan_status_kesehatan_mental_dalam_bahasa_Indonesia",
  "recommendations": ["rekomendasi1", "rekomendasi2", "rekomendasi3"]
}

Catatan: Semua angka harus berupa angka, bukan string.`
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
          content: `Please analyze this mental health transcript: "${transcript}"`
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
    const parsedResult = JSON.parse(result) as MentalHealthAnalysis;
    
    // Validate the response
    if (typeof parsedResult.mental_score !== 'number' || 
        !parsedResult.mood_category || 
        typeof parsedResult.stress_level !== 'number' ||
        typeof parsedResult.anxiety_level !== 'number' ||
        typeof parsedResult.depression_level !== 'number') {
      return null;
    }

    // Ensure scores are within valid ranges
    parsedResult.mental_score = Math.max(0, Math.min(100, parsedResult.mental_score));
    parsedResult.stress_level = Math.max(0, Math.min(100, parsedResult.stress_level));
    parsedResult.anxiety_level = Math.max(0, Math.min(100, parsedResult.anxiety_level));
    parsedResult.depression_level = Math.max(0, Math.min(100, parsedResult.depression_level));

    // Ensure mood category is valid
    const validMoodCategories = ['excellent', 'good', 'fair', 'poor', 'critical'];
    if (!validMoodCategories.includes(parsedResult.mood_category)) {
      parsedResult.mood_category = 'fair';
    }

    return parsedResult;

  } catch (error) {
    console.error('Error analyzing mental health:', error);
    return null;
  }
}
