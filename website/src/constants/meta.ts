import { WEBSITE_URL } from "@config";

export const TITLE = "Aleksa Cukovic";

export const DESCRIPTION = `\
Personal website of Aleksa Cukovic - a software engineer, aspiring entrepreneur and occasional shitposter.
`;

const ogImage = `${WEBSITE_URL}/assets/og-image-vWI8A9IlFTgoEQF8bUsQS.jpg`;

export const tags = {
  author: "Aleksa Cukovic",
  description: DESCRIPTION,
  "og:type": "article",
  "og:image": ogImage,
  "twitter:card": "summary_large_image",
  "twitter:site": "@Aleksa_C_",
} as const;
