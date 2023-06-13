const path = require("path");

module.exports = {
  entry: {
    main: "./src/preload.ts",
  },
  output: {
    filename: "preload.js",
    path: path.resolve(__dirname, "../electron-main/dist"),
  },
  target: "electron-preload",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
};
