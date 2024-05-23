import Document, { Html, Head, Main, NextScript } from "next/document";

import { THEME_KEY } from "@constants/theme";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              if (localStorage.getItem(
                "${THEME_KEY}") === "dark" ||
                (!("${THEME_KEY}" in localStorage) && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
              ) {
                document.documentElement.classList.add("dark");
                localStorage.setItem("${THEME_KEY}", "dark");
              } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("${THEME_KEY}", "light");
              }
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
