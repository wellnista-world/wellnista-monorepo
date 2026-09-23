import { describe, it, expect, vi } from "vitest";
import {
  clearCartFromStorage,
  getCartItemCount,
  getCartKey,
  getCartTotal,
  loadCartFromStorage,
  mergeCarts,
  saveCartToStorage,
} from "../cartUtils";
import type { CartItem } from "../../context/CartContext";
import type { Product } from "../../../../config/products";

function product(id: number, price: number): Product {
  const text = { name: `P${id}`, description: "" };
  return {
    id,
    name: `P${id}`,
    description: "",
    price,
    currency: "฿",
    image: "",
    link: `product/${id}`,
    category: "test",
    priceId: `price_${id}`,
    translations: { th: text, en: text, zh: text, ja: text, ko: text, id: text },
  };
}

const item = (id: number, price: number, quantity: number): CartItem => ({
  product: product(id, price),
  quantity,
});

describe("cart storage", () => {
  it("keys the cart per user, with a shared anonymous cart", () => {
    expect(getCartKey()).toBe("cart_anonymous");
    expect(getCartKey("u1")).toBe("cart_u1");
  });

  it("round-trips a cart through localStorage", () => {
    const cart = [item(1, 100, 2)];
    saveCartToStorage(cart, "u1");
    expect(loadCartFromStorage("u1")).toEqual(cart);
    // A different user does not see it.
    expect(loadCartFromStorage("u2")).toEqual([]);
  });

  it("returns an empty cart when nothing is stored or the JSON is corrupt", () => {
    expect(loadCartFromStorage()).toEqual([]);
    localStorage.setItem("cart_anonymous", "{not json");
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(loadCartFromStorage()).toEqual([]);
    expect(spy).toHaveBeenCalled();
  });

  it("clears only the requested cart", () => {
    saveCartToStorage([item(1, 10, 1)]);
    saveCartToStorage([item(2, 10, 1)], "u1");
    clearCartFromStorage();
    expect(loadCartFromStorage()).toEqual([]);
    expect(loadCartFromStorage("u1")).toHaveLength(1);
  });
});

describe("mergeCarts", () => {
  it("adds quantities for shared products and appends the rest", () => {
    const merged = mergeCarts([item(1, 100, 1), item(2, 50, 3)], [item(1, 100, 2), item(3, 20, 1)]);
    expect(merged.map((i) => [i.product.id, i.quantity])).toEqual([
      [1, 3],
      [2, 3],
      [3, 1],
    ]);
  });

  it("returns the user cart unchanged when the anonymous cart is empty", () => {
    const user = [item(1, 100, 1)];
    expect(mergeCarts(user, [])).toEqual(user);
  });
});

describe("cart totals", () => {
  it("sums price × quantity and counts every unit", () => {
    const cart = [item(1, 100, 2), item(2, 50.5, 3)];
    expect(getCartTotal(cart)).toBe(351.5);
    expect(getCartItemCount(cart)).toBe(5);
  });

  it("is zero for an empty cart", () => {
    expect(getCartTotal([])).toBe(0);
    expect(getCartItemCount([])).toBe(0);
  });
});
