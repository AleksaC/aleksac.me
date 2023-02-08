/* eslint-disable node/no-process-env */

const withPreact = require("next-plugin-preact");

const str2Bool = (str) =>
  str.toLowerCase() in
  ["true", "1", "y", "yes"].reduce((o, k) => ({ ...o, [k]: null }), {});

const withBundleAnalyzer =
  process.env.ANALYZE === "true"
    ? require("@next/bundle-analyzer")({
        enabled: true,
      })
    : (obj) => obj;

module.exports = withBundleAnalyzer(
  withPreact({
    experimental: {
      browsersListForSwc: true,
      legacyBrowsers: false,
    },
    typescript: {
      ignoreBuildErrors: str2Bool(process.env.CI || "false"),
    },
    eslint: {
      ignoreDuringBuilds: str2Bool(process.env.CI || "false"),
    },
  }),
);
