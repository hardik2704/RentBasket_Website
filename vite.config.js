import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ command, mode }) => ({
  base: mode === 'production' ? '/RentBasket_Website/' : '/', // dev root, prod GitHub Pages base
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    // Vitest runs only src/ unit tests — e2e/ is Playwright's domain (Layer 3)
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
    exclude: ["e2e/**", "node_modules/**", "dist/**"],
    environment: "jsdom",
  },
}));
