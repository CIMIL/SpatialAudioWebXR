import basicSsl from "@vitejs/plugin-basic-ssl";

export default {
  plugins: [basicSsl()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        A1: "A1.html",
      },
    },
  },
};
