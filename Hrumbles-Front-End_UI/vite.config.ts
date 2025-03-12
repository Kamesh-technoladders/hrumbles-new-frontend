import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8081,
      strictPort: true,
      hmr: {
        protocol: "ws",
        timeout: 30000,
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "process.env": env,
    },
    build: {
      outDir: "dist",
      sourcemap: mode === "development",
      chunkSizeWarningLimit: 1000, // Adjust warning limit

      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom"],
            "jspdf": ["jspdf"],
            "html2canvas": ["html2canvas"],
            "lodash": ["lodash"], // If used, split lodash
            "chart-libraries": ["recharts", "d3"], // Split chart libraries
          },
        },
      },
    },
  };
});
