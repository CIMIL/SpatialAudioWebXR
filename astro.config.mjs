import { defineConfig } from "astro/config";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [basicSsl()],
    resolve: {
      alias: {
        "@": "./src",
        "@public": "./public",
        "@utils": "./src/utils",
      },
    },
  },
});
