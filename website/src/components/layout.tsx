import { FC } from "react";

import Header from "@components/header";
import Meta from "@components/meta";
import GoToTopButton from "@components/go-to-top";
import { tags as defaultTags } from "@constants/meta";

const Layout: FC<{ meta?: Record<string, string> }> = ({
  meta = {},
  children,
}) => {
  const tags = { ...defaultTags, ...meta };

  return (
    <>
      <Meta tags={tags} />
      <div className="dark:text-whiteish">
        <Header />
        <main className="mx-auto max-w-6xl px-5">
          <div>{children}</div>
          <div className="my-10 text-center">
            🚧
            <span className="px-2 text-sm italic">
              The website is still under construction!
            </span>
            🚧
          </div>
        </main>
        <GoToTopButton />
      </div>
    </>
  );
};

export default Layout;
