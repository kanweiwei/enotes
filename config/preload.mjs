import { Parcel } from "@parcel/core";

let bundler = new Parcel({
  entries: "./src/main/preload.ts",
  defaultConfig: "@parcel/config-default",
  targets: {
    main: {
      distDir: "dist",
      context: "electron-main",
      outputFormat: "commonjs",
    },
  },
});

await bundler.run();
