/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/types.ts", "src/main.tsx", "src/vite-env.d.ts"],
    },
  },
});
