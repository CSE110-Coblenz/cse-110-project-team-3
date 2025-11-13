import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // so DOM APIs exist (window, document, etc.)
    globals: true, // allows `describe`, `it`, `expect` without imports
    include: ["tests/**/*.test.ts", "tests/**/*.spec.ts"], // adjust to your folder
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
