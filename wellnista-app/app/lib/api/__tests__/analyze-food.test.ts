import { describe, it, expect } from "vitest";
import { FoodAnalysisError, parseFoodAnalysis } from "../analyze-food";

describe("parseFoodAnalysis", () => {
  it("returns the nutrition object for a food reply and fills defaults", () => {
    const r = parseFoodAnalysis(
      JSON.stringify({
        food: true,
        product_name: "ผัดไทย",
        product_name_en: "Pad Thai",
        product_name_th: "ผัดไทย",
        nutriments: { "energy-kcal_serving": 400, carbohydrates: 50 },
      })
    );
    expect(r).not.toBeNull();
    expect(r!.product_name).toBe("ผัดไทย");
    expect(r!.brands).toBe("Unknown");
    expect(r!.nutriments["energy-kcal_serving"]).toBe(400);
  });

  it("fills missing name variants from whichever name is present", () => {
    const r = parseFoodAnalysis(JSON.stringify({ product_name_en: "Green curry" }));
    expect(r).toMatchObject({
      product_name: "Green curry",
      product_name_en: "Green curry",
      product_name_th: "Green curry",
      nutriments: {},
    });
  });

  it("returns null when the model says the picture is not food", () => {
    expect(parseFoodAnalysis('{"food": false}')).toBeNull();
    expect(parseFoodAnalysis('{"result": null}')).toBeNull();
    expect(parseFoodAnalysis("null")).toBeNull();
    expect(parseFoodAnalysis('{"product_name": ""}')).toBeNull();
  });

  it("throws a FoodAnalysisError for empty or malformed replies", () => {
    expect(() => parseFoodAnalysis("")).toThrow(FoodAnalysisError);
    expect(() => parseFoodAnalysis(undefined)).toThrow(FoodAnalysisError);
    expect(() => parseFoodAnalysis("{not json")).toThrow(/valid JSON/);
  });
});

describe("FoodAnalysisError", () => {
  it("carries a code and HTTP status", () => {
    const e = new FoodAnalysisError("openai_error", "quota", 429);
    expect(e.code).toBe("openai_error");
    expect(e.status).toBe(429);
    expect(e.message).toBe("quota");
    expect(new FoodAnalysisError("bad_response", "x").status).toBe(502);
  });
});
