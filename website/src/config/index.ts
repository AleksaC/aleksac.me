/* eslint-disable node/no-process-env */
import { assert, stripTrailingSlash, strToBool } from "@/utils";

export const environments = {
  PROD: "production",
  DEV: "development",
  // test is not added because tests aren't used and are unlikely ever to be used
} as const;

export const env = process.env
  .NODE_ENV as (typeof environments)[keyof typeof environments];
assert(
  Object.values(environments).includes(env),
  `${env} is not a valid value for NODE_ENV. Must be one of: ${Object.values(
    environments,
  ).join(", ")}`,
);

export const WEBSITE_URL = stripTrailingSlash(
  process.env.WEBSITE_URL || "https://aleksac.me",
);

export const GENERATE_RSS =
  strToBool(process.env.GENERATE_RSS ?? "false") ||
  process.env.NODE_ENV === environments.PROD;

export const GENERATE_SITEMAP =
  strToBool(process.env.GENERATE_RSS ?? "false") ||
  process.env.NODE_ENV === environments.PROD;
