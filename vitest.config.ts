import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8", // ou 'c8'
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      exclude: ["**/node_modules/**", "**/tests/**"],
    },
  },
});
