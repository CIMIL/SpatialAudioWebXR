import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "@": "./src",
        "@public": "./public",
        "@utils": "./src/utils",
      },
    },
  },
});
