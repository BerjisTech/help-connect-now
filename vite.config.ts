
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      // The plugin-react-swc doesn't accept a babel option directly
      // Instead, we need to use the proper configuration format
      plugins: mode === 'production' 
        ? [['babel-plugin-jsx-remove-data-test-id', { attributes: ['data-lov-id'] }]] 
        : []
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
