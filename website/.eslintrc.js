module.exports = {
  root: true,
  extends: ["eslint-config-aleksac/next"],
  rules: {
    "no-console": ["error"],
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
  reportUnusedDisableDirectives: true,
};
