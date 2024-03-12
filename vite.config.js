import basicSsl from "@vitejs/plugin-basic-ssl";

/** @type {import('vite').UserConfig} */
export default {
  plugins: [basicSsl()],
  root: "src",
  publicDir: "../public",
  resolve: {
    alias: {
      "@": "./src",
      "@public": "./public",
      "@utils": "./src/utils",
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        A1: "A1.html",
        A2: "A2.html",
      },
    },
  },
};
