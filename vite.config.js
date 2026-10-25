import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import process from "process";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      port: Number(env.APP_PORT) || 5173,
    },
    preview: {
      port: Number(env.APP_PORT) || 5173,
    },
    define: {
      // Alamat back-end (Express.js). Ubah lewat VITE_API_URL di .env atau ganti nilai bawaan ini.
      API_BASEURL: JSON.stringify(
        env.VITE_API_URL || "https://ifs24046-pabwe2026-proyek1-be.onrender.com"
      ),
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html", "lcov"],
        include: ["src/**/*.{js,jsx}"],
        exclude: [
          "node_modules/**",
          "src/main.jsx",
          "src/setupTests.js",
          "src/test-utils.jsx",
          "src/**/*.test.{js,jsx}",
          "vite.config.js",
          "index.html",
        ],
        thresholds: {
          lines: 100,
          functions: 100,
          branches: 100,
          statements: 100,
        },
      },
    },
  };
});
