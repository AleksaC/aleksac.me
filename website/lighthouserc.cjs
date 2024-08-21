/* eslint-disable node/no-process-env */

const fs = require("fs");
const path = require("path");

const stripSuffix = (str) => path.parse(str).name;

const posts = [
  ...fs
    .readdirSync("src/content/blog")
    .map((post) => `/blog/${stripSuffix(post)}/`),
  ...fs
    .readdirSync("src/content/til")
    .map((post) => `/til/${stripSuffix(post)}/`),
];

const urls = ["/", "/blog/", "/til/", ...posts];

const str2Bool = (str) =>
  str.toLowerCase() in
  ["true", "1", "y", "yes"].reduce((o, k) => ({ ...o, [k]: null }), {});

const prefix = process.env.WEBSITE_URL || "http://127.0.0.1:4321";
const isPreview = str2Bool(process.env.PREVIEW || "false");
const deviceType = process.env.DEVICE_TYPE || "mobile";

module.exports = {
  ci: {
    collect: {
      numberOfRuns: str2Bool(process.env.CI || "false") ? 3 : 1,
      url: urls.map((url) => new URL(`${url}?${deviceType}`, prefix).href),
      settings: {
        preset: deviceType === "desktop" ? "desktop" : undefined,
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
    assert: {
      preset: "lighthouse:no-pwa",
      assertions: {
        "is-crawlable": isPreview ? "off" : "error",
        // we need theme setter to be render-blocking to prevent flicker
        "render-blocking-resources": ["error", { maxLength: 1 }],
        // since this is a static website with no user input and no third party
        // scripts at the moment adding csp is more trouble than it's worth
        "csp-xss": "off",
        // the assertion will always fail for comments in code blocks, and it seems
        // there is no way to fix this, instead assertion is added for the entire
        // accessibility category score
        "color-contrast": "off",
        "categories:performance": ["warn", { minScore: 1 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
      },
    },
  },
};
