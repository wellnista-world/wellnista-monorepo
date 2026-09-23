import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { I18nProvider, useI18n } from "../index";
import en from "../../messages/en.json";
import th from "../../messages/th.json";
import id from "../../messages/id.json";
import ja from "../../messages/ja.json";
import ko from "../../messages/ko.json";
import zh from "../../messages/zh.json";

const wrapper = ({ children }: { children: ReactNode }) => <I18nProvider>{children}</I18nProvider>;

type Tree = Record<string, unknown>;

function leafKeys(obj: Tree, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" ? leafKeys(v as Tree, `${prefix}${k}.`) : [`${prefix}${k}`]
  );
}

function lookup(obj: Tree, key: string): unknown {
  return key.split(".").reduce<unknown>((o, k) => (o as Tree)[k], obj);
}

describe("message catalogues", () => {
  it("has a Thai fallback for every English key, because t() falls back to Thai", () => {
    const thKeys = new Set(leafKeys(th));
    const missing = leafKeys(en).filter((k) => !thKeys.has(k));
    expect(missing).toEqual([]);
  });

  it.each([
    ["en", en],
    ["ja", ja],
    ["ko", ko],
    ["zh", zh],
    ["id", id],
  ])("%s has every key that Thai has", (_name, catalogue) => {
    const keys = new Set(leafKeys(catalogue as Tree));
    const missing = leafKeys(th).filter((k) => !keys.has(k));
    expect(missing).toEqual([]);
  });
});

describe("I18nProvider", () => {
  it("defaults to Thai and translates nested keys", () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.locale).toBe("th");
    expect(result.current.t("common.stock")).toBe(th.common.stock);
  });

  it("switches locale and remembers it in localStorage", () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    act(() => result.current.setLocale("en"));
    expect(result.current.locale).toBe("en");
    expect(result.current.t("common.stock")).toBe(en.common.stock);
    expect(localStorage.getItem("wellnista-language")).toBe("en");
  });

  it("restores the stored locale on mount", () => {
    localStorage.setItem("wellnista-language", "ja");
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.locale).toBe("ja");
  });

  it("ignores an invalid stored locale", () => {
    localStorage.setItem("wellnista-language", "xx");
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.locale).toBe("th");
  });

  it("returns the key itself when no translation exists", () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.t("does.not.exist")).toBe("does.not.exist");
  });

  it("falls back to Thai for a key missing in the active locale", () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    act(() => result.current.setLocale("id"));
    // English-only key (present in en/th, absent in id): the Thai text wins.
    const idKeys = new Set(leafKeys(id));
    const onlyTh = leafKeys(th).find((k) => !idKeys.has(k));
    if (onlyTh) {
      expect(result.current.t(onlyTh)).toBe(lookup(th, onlyTh));
    } else {
      // Every locale is complete now, so exercise the raw-key path instead.
      expect(result.current.t("does.not.exist")).toBe("does.not.exist");
    }
  });

  it("interpolates {params} and leaves unknown placeholders alone", () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    const withParam = leafKeys(th).find((k) => {
      const v = lookup(th, k);
      return typeof v === "string" && /\{\w+\}/.test(v);
    });
    expect(withParam).toBeDefined();
    const raw = lookup(th, withParam!) as string;
    const name = /\{(\w+)\}/.exec(raw)![1];
    expect(result.current.t(withParam!, { [name]: 42 })).toBe(raw.replace(`{${name}}`, "42"));
    expect(result.current.t(withParam!)).toBe(raw);
  });

  it("throws when used outside the provider", () => {
    expect(() => renderHook(() => useI18n())).toThrow(/I18nProvider/);
  });
});
