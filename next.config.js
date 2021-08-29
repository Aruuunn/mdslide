const removeImports = require("next-remove-imports")();
const withPWA = require("next-pwa");

module.exports = withPWA(
  removeImports({
    pwa: {
      dest: "public",
    },
  })
);
