/**
 * Nutrition Calculator Utility
 *
 * Provides centralized calculations for BMR, TDEE, and carbohydrate requirements
 * based on user profile data.
 */

export interface NutritionCalculationInput {
  gender: 'male' | 'female' | 'ชาย' | 'หญิง';
  age: number;
  weight: number; // kg
  height: number; // cm
  activityLevel: number; // 1.2, 1.375, 1.55, 1.725, or 1.9
  carbRatio?: number; // default 0.20 (20% of TDEE)
}

export interface NutritionCalculationResult {
  bmr: number;           // kcal/day - Basal Metabolic Rate
  tdee: number;          // kcal/day - Total Daily Energy Expenditure
  carbKcal: number;      // kcal/day - Daily carb energy
  carbGrams: number;     // grams/day - Daily carb grams
  carbServings: number;  // servings/day - Daily carb servings (1 serving = 15g)
  isValid: boolean;
  errors: string[];
}

/**
 * Activity level constants
 */
export const ACTIVITY_LEVELS = {
  SEDENTARY: 1.2,        // ไม่ออกกำลังกาย/นั่งทำงานอยู่กับที่
  LIGHT: 1.375,          // ออกกำลังกายเล็กน้อย 1-3วัน/สัปดาห์
  MODERATE: 1.55,        // ออกกำลังกายปานกลาง 3-5วัน/สัปดาห์
  HEAVY: 1.725,          // ออกกำลังกายหนัก 6-7วัน/สัปดาห์
  VERY_HEAVY: 1.9        // ออกกำลังกายหนักมาก/ทำงานใช้แรงมาก
} as const;

/**
 * Activity level Thai descriptions
 */
export const ACTIVITY_LEVEL_DESCRIPTIONS = [
  "ไม่ออกกำลังกาย/นั่งทำงานอยู่กับที่",
  "ออกกำลังกายเล็กน้อย 1-3วัน/สัปดาห์",
  "ออกกำลังกายปานกลาง 3-5วัน/สัปดาห์",
  "ออกกำลังกายหนัก 6-7วัน/สัปดาห์",
  "ออกกำลังกายหนักมาก 2 ครั้ง/วัน เป็นนักกีฬา",
] as const;

/**
 * Activity level values array
 */
export const ACTIVITY_LEVEL_VALUES = [1.2, 1.375, 1.55, 1.725, 1.9] as const;

/**
 * Carbohydrate calculation constants
 */
const CARB_KCAL_PER_GRAM = 4; // 1 gram of carbohydrate = 4 kcal
const CARB_GRAMS_PER_SERVING = 15; // 1 serving = 15 grams of carbohydrate
const DEFAULT_CARB_RATIO = 0.20; // 20% of TDEE from carbohydrates

/**
 * Validation ranges
 */
const VALIDATION_RANGES = {
  age: { min: 1, max: 120 },
  weight: { min: 1, max: 300 },
  height: { min: 50, max: 250 },
};

/**
 * Normalizes gender input to handle both Thai and English inputs
 */
function normalizeGender(gender: string): 'male' | 'female' {
  const normalized = gender.toLowerCase();
  if (normalized === 'male' || normalized === 'ชาย') {
    return 'male';
  }
  if (normalized === 'female' || normalized === 'หญิง') {
    return 'female';
  }
  // Default to male if invalid
  return 'male';
}

/**
 * Validates input parameters
 */
function validateInput(input: NutritionCalculationInput): string[] {
  const errors: string[] = [];

  if (input.age < VALIDATION_RANGES.age.min || input.age > VALIDATION_RANGES.age.max) {
    errors.push(`Age must be between ${VALIDATION_RANGES.age.min} and ${VALIDATION_RANGES.age.max}`);
  }

  if (input.weight <= 0 || input.weight > VALIDATION_RANGES.weight.max) {
    errors.push(`Weight must be between 1 and ${VALIDATION_RANGES.weight.max} kg`);
  }

  if (input.height < VALIDATION_RANGES.height.min || input.height > VALIDATION_RANGES.height.max) {
    errors.push(`Height must be between ${VALIDATION_RANGES.height.min} and ${VALIDATION_RANGES.height.max} cm`);
  }

  if (input.activityLevel <= 0) {
    errors.push('Activity level must be greater than 0');
  }

  if (input.carbRatio && (input.carbRatio < 0 || input.carbRatio > 1)) {
    errors.push('Carb ratio must be between 0 and 1');
  }

  return errors;
}

/**
 * Calculates Basal Metabolic Rate (BMR) using Harris-Benedict Equation
 *
 * Male: BMR = 66 + (13.7 × weight_kg) + (5 × height_cm) − (6.8 × age_years)
 * Female: BMR = 665 + (9.6 × weight_kg) + (1.8 × height_cm) − (4.7 × age_years)
 */
function calculateBMR(gender: 'male' | 'female', weight: number, height: number, age: number): number {
  if (gender === 'male') {
    return 66 + (13.7 * weight) + (5 * height) - (6.8 * age);
  } else {
    return 665 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
  }
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE)
 *
 * TDEE = BMR × Activity Factor
 */
function calculateTDEE(bmr: number, activityLevel: number): number {
  return bmr * activityLevel;
}

/**
 * Calculates daily carbohydrate requirements
 */
function calculateCarbRequirements(tdee: number, carbRatio: number = DEFAULT_CARB_RATIO) {
  const carbKcal = tdee * carbRatio;
  const carbGrams = carbKcal / CARB_KCAL_PER_GRAM;
  const carbServings = carbGrams / CARB_GRAMS_PER_SERVING;

  return {
    carbKcal,
    carbGrams,
    carbServings,
  };
}

/**
 * Main calculation function
 *
 * Calculates BMR, TDEE, and carbohydrate requirements based on user profile
 *
 * @param input - User profile data
 * @returns Nutrition calculation results with validation status
 */
export function calculateNutrition(input: NutritionCalculationInput): NutritionCalculationResult {
  // Validate input
  const errors = validateInput(input);

  if (errors.length > 0) {
    return {
      bmr: 0,
      tdee: 0,
      carbKcal: 0,
      carbGrams: 0,
      carbServings: 0,
      isValid: false,
      errors,
    };
  }

  // Normalize gender
  const gender = normalizeGender(input.gender);

  // Calculate BMR
  const bmr = calculateBMR(gender, input.weight, input.height, input.age);

  // Calculate TDEE
  const tdee = calculateTDEE(bmr, input.activityLevel);

  // Calculate carb requirements
  const carbRatio = input.carbRatio ?? DEFAULT_CARB_RATIO;
  const { carbKcal, carbGrams, carbServings } = calculateCarbRequirements(tdee, carbRatio);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    carbKcal: Math.round(carbKcal),
    carbGrams: Math.round(carbGrams),
    carbServings: Math.round(carbServings * 10) / 10, // Round to 1 decimal place
    isValid: true,
    errors: [],
  };
}

/**
 * Helper function to get activity level value from Thai description
 */
export function getActivityLevelFromDescription(description: string): number {
  const index = ACTIVITY_LEVEL_DESCRIPTIONS.findIndex(desc => desc === description);
  return index >= 0 ? ACTIVITY_LEVEL_VALUES[index] : ACTIVITY_LEVELS.SEDENTARY;
}
