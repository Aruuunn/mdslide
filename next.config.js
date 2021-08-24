const removeImports = require("next-remove-imports")();
const withOffline = require("next-offline");

module.exports = removeImports(
  withOffline({
    workboxOpts: {
      runtimeCaching: [
        {
          urlPattern:
            /(www\.googleapis\.com\/webfonts\/v1\/webfonts|fonts\.gstatic\.com\/l\/font|fonts\.googleapis\.com\/css)/,
          handler: "CacheFirst",
        },
      ],
    },
  })
);
