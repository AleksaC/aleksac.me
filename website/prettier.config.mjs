/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  plugins: [
    import.meta.resolve("prettier-plugin-astro"),
    import.meta.resolve("prettier-plugin-tailwindcss"),
  ],
};

export default config;
