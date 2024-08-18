/* eslint-disable node/no-process-env */

const urls = ["/", "/blog", "/til"];

const str2Bool = (str) =>
  str.toLowerCase() in
  ["true", "1", "y", "yes"].reduce((o, k) => ({ ...o, [k]: null }), {});

const prefix = process.env.WEBSITE_URL || "http://localhost:4321";
const isPreview = str2Bool(process.env.PREVIEW || "false");
const deviceType = process.env.DEVICE_TYPE || "mobile";

// TODO: see if ESM modules/typescript can be used
// TODO: test & update
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
        // since this is a static website with no user input and no third party
        // scripts at the moment adding csp is more trouble than it's worth
        "csp-xss": "off",
        // Next seems to add touchstart event listeners to anchor tags (since version 12.3)
        // so we will alway have this error and since it's not worth downgrading
        // the Next version for this rule there is no point in keeping it.
        // Also the problem is not with next per se but in next + preact as preact
        // doesn't add passive event listeners. There is a draft PR for adding this
        // but according to the following comment browsers treat event listeners
        // as passive anyway so it isn't needed
        // https://github.com/preactjs/preact/pull/3769#issuecomment-1281134132
        "uses-passive-event-listeners": "off",
      },
    },
  },
};
