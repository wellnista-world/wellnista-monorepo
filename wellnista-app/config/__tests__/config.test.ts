import { describe, it, expect } from "vitest";
import {
  getAllCategories,
  getProductById,
  getProductForLocale,
  getProductsByCategory,
  getRandomProduct,
  products,
} from "../products";
import { countryCodes, getCountryByDialCode, getDefaultCountry } from "../countryCodes";
import { defaultFeatureFlags, isFeatureEnabled, isMarketEnabled } from "../featureFlags";
import { appConfig, getAppName, getAppShortName } from "../app";

describe("products catalogue", () => {
  it("has unique ids and a Stripe price id on every product", () => {
    const ids = products.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of products) {
      expect(p.priceId).toMatch(/^price_/);
      expect(p.price).toBeGreaterThan(0);
    }
  });

  it("looks products up by id and by category", () => {
    const first = products[0];
    expect(getProductById(first.id)).toBe(first);
    expect(getProductById(-1)).toBeUndefined();
    expect(getProductsByCategory(first.category)).toContain(first);
    expect(getProductsByCategory("no-such-category")).toEqual([]);
  });

  it("lists each category once", () => {
    const cats = getAllCategories();
    expect(new Set(cats).size).toBe(cats.length);
    for (const p of products) expect(cats).toContain(p.category);
  });

  it("localises name and description, falling back to the defaults", () => {
    const first = products[0];
    const en = getProductForLocale(first, "en");
    expect(en.name).toBe(first.translations.en.name);
    expect(en.description).toBe(first.translations.en.description);
    // Unknown locale keeps the product's own text and everything else.
    const fr = getProductForLocale(first, "fr");
    expect(fr.name).toBe(first.name);
    expect(fr.description).toBe(first.description);
    expect(fr.priceId).toBe(first.priceId);
    // The source object is not mutated.
    expect(first.name).toBe(products[0].name);
  });

  it("always returns a catalogue product at random", () => {
    for (let i = 0; i < 20; i += 1) {
      expect(products).toContain(getRandomProduct());
    }
  });
});

describe("country codes", () => {
  it("defaults to Thailand", () => {
    expect(getDefaultCountry().code).toBe("TH");
    expect(getDefaultCountry().dialCode).toBe("+66");
  });

  it("finds a country by dial code", () => {
    expect(getCountryByDialCode("+66")?.code).toBe("TH");
    expect(getCountryByDialCode("+000")).toBeUndefined();
  });

  it("has unique ISO codes and a name in every supported language", () => {
    const codes = countryCodes.map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
    for (const c of countryCodes) {
      for (const lang of ["en", "th", "zh", "ja", "ko", "id"] as const) {
        expect(c.name[lang]).toBeTruthy();
      }
      expect(c.dialCode).toMatch(/^\+\d+/);
    }
  });
});

describe("feature flags", () => {
  it("reads the enabled bit of a known feature", () => {
    expect(isMarketEnabled()).toBe(defaultFeatureFlags.market.enabled);
    expect(isFeatureEnabled("scanning")).toBe(defaultFeatureFlags.scanning.enabled);
  });

  it("treats an unknown feature as disabled", () => {
    expect(isFeatureEnabled("nope" as never)).toBe(false);
  });
});

describe("app config", () => {
  it("brands the app as NubSook", () => {
    expect(getAppName()).toBe("NubSook");
    expect(getAppShortName()).toBe(appConfig.shortName);
  });
});
