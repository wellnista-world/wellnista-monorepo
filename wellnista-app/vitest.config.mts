import { defineConfig } from "vitest/config";
import path from "path";

// Vitest + jsdom. JSX in tests is compiled by Vitest's built-in transformer
// with the automatic runtime, so no Babel-based React plugin is needed.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/__tests__/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "**/__tests__/**", "**/*.d.ts", ".next/**", "public/**"],
    },
  },
});
