const path = require("path");

module.exports = {
  entry: {
    main: "./src/index.ts",
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  target: "electron-main",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  externals: {
    knex: "commonjs knex",
    sqlite3: "commonjs sqlite3",
  },
};
