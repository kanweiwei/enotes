const path = require("path");

module.exports = {
  entry: {
    main: "./src/index.tsx",
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  builtins: {
    html: [{ template: "./public/index.html" }],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: "postcss-loader",
          },
          {
            loader: "less-loader",
          },
        ],
        type: "css",
      },
    ],
  },
};
