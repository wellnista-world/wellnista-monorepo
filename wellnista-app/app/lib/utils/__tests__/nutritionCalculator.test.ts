import { describe, it, expect } from "vitest";
import {
  ACTIVITY_LEVELS,
  ACTIVITY_LEVEL_DESCRIPTIONS,
  ACTIVITY_LEVEL_VALUES,
  calculateNutrition,
  getActivityLevelFromDescription,
} from "../nutritionCalculator";

const male = {
  gender: "male" as const,
  age: 30,
  weight: 70,
  height: 175,
  activityLevel: ACTIVITY_LEVELS.SEDENTARY,
};

describe("calculateNutrition", () => {
  it("uses the Harris-Benedict male equation", () => {
    // 66 + 13.7*70 + 5*175 - 6.8*30 = 1696
    const r = calculateNutrition(male);
    expect(r.isValid).toBe(true);
    expect(r.errors).toEqual([]);
    expect(r.bmr).toBe(1696);
    expect(r.tdee).toBe(Math.round(1696 * 1.2)); // 2035
  });

  it("uses the Harris-Benedict female equation", () => {
    // 665 + 9.6*60 + 1.8*165 - 4.7*25 = 1420.5
    const r = calculateNutrition({
      gender: "female",
      age: 25,
      weight: 60,
      height: 165,
      activityLevel: ACTIVITY_LEVELS.MODERATE,
    });
    expect(r.bmr).toBe(Math.round(1420.5));
    expect(r.tdee).toBe(Math.round(1420.5 * 1.55));
  });

  it("accepts Thai gender labels", () => {
    expect(calculateNutrition({ ...male, gender: "ชาย" }).bmr).toBe(
      calculateNutrition({ ...male, gender: "male" }).bmr
    );
    expect(calculateNutrition({ ...male, gender: "หญิง" }).bmr).toBe(
      calculateNutrition({ ...male, gender: "female" }).bmr
    );
  });

  it("derives carbs as 20% of TDEE by default: 4 kcal/g, 15 g per serving", () => {
    const r = calculateNutrition(male);
    const tdee = 1696 * 1.2;
    expect(r.carbKcal).toBe(Math.round(tdee * 0.2));
    expect(r.carbGrams).toBe(Math.round((tdee * 0.2) / 4));
    expect(r.carbServings).toBe(Math.round(((tdee * 0.2) / 4 / 15) * 10) / 10);
  });

  it("honours a custom carb ratio", () => {
    const r = calculateNutrition({ ...male, carbRatio: 0.5 });
    expect(r.carbKcal).toBe(Math.round(1696 * 1.2 * 0.5));
  });

  it("rejects out-of-range inputs and reports every problem", () => {
    const r = calculateNutrition({
      gender: "male",
      age: 0,
      weight: 400,
      height: 20,
      activityLevel: 0,
      carbRatio: 2,
    });
    expect(r.isValid).toBe(false);
    expect(r.errors).toHaveLength(5);
    expect(r.bmr).toBe(0);
    expect(r.tdee).toBe(0);
  });

  it("rejects each invalid field on its own", () => {
    expect(calculateNutrition({ ...male, age: 121 }).errors).toHaveLength(1);
    expect(calculateNutrition({ ...male, weight: 0 }).errors).toHaveLength(1);
    expect(calculateNutrition({ ...male, height: 251 }).errors).toHaveLength(1);
    expect(calculateNutrition({ ...male, activityLevel: -1 }).errors).toHaveLength(1);
  });
});

describe("activity levels", () => {
  it("keeps descriptions and values aligned", () => {
    expect(ACTIVITY_LEVEL_DESCRIPTIONS).toHaveLength(ACTIVITY_LEVEL_VALUES.length);
    ACTIVITY_LEVEL_DESCRIPTIONS.forEach((desc, i) => {
      expect(getActivityLevelFromDescription(desc)).toBe(ACTIVITY_LEVEL_VALUES[i]);
    });
  });

  it("falls back to sedentary for an unknown description", () => {
    expect(getActivityLevelFromDescription("???")).toBe(ACTIVITY_LEVELS.SEDENTARY);
  });
});
