const removeImports = require("next-remove-imports")();
const withOffline = require("next-offline");

module.exports = removeImports(
  withOffline({
    workboxOpts: {
      swDest: "../public/service-worker.js",
    },
  })
);
