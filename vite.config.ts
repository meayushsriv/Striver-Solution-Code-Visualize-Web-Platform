import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Striver-Solution-Code-Visualize-Web-Platform/",
  plugins: [react()],
  server: {
    port: 5173
  }
});
