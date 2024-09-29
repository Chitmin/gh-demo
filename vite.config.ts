/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    include: ["./tests/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    environment: "jsdom",
    setupFiles: ["./test.setup.ts"],
  },
});
