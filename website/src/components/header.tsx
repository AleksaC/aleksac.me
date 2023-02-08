import Link from "next/link";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useState, FC } from "react";

import ThemeToggle from "@components/themeToggle";
import socialMedia from "@constants/social-media";
import RssIcon from "@components/icons/rss";

type Route = {
  name: string;
  href: string;
  match: (url: string) => boolean;
};

type IconLink = {
  icon: FC;
  link: string;
};
type Links = Record<string, IconLink>;

const routes: Route[] = [
  {
    name: "About",
    href: "/",
    match: function (route) {
      return route === this.href;
    },
  },
  {
    name: "Blog",
    href: "/blog",
    match: function (route) {
      return route.startsWith(this.href);
    },
  },
  {
    name: "TIL",
    href: "/til",
    match: function (route) {
      return route.startsWith(this.href);
    },
  },
];

const links = {
  RSS: {
    icon: RssIcon,
    link: "/feed.xml",
  },
  ...socialMedia,
};

const Nav: FC<{
  routes: Route[];
  links: Links;
}> = ({ routes, links }) => {
  const router = useRouter();
  const { route: currentRoute } = router;

  return (
    <>
      <div className="flex-col md:space-x-4 -md:flex">
        {routes.map((route) => (
          <Link href={route.href} key={route.name}>
            <a
              className={classNames(
                "font-bold hover:underline -md:border-b -md:border-current -md:py-2 -md:pl-4",
                route.match(currentRoute) && "md:underline",
              )}
            >
              {route.name}
            </a>
          </Link>
        ))}
      </div>
      <div className="flex items-center space-x-4 -md:mt-4 -md:pl-4">
        {Object.entries(links).map(([name, { link, icon: Icon }]) => (
          <a href={link} key={name} title={name.toLowerCase()}>
            <Icon />
          </a>
        ))}
      </div>
    </>
  );
};

const Header = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);

  return (
    <header className="mb-6 border-b border-current md:mb-12">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 pt-5 pb-4 leading-tight tracking-tight md:pt-8 md:pb-8 md:tracking-tighter">
        <Link href="/">
          <a className="text-2xl font-bold hover:no-underline md:text-4xl">
            Aleksa Cukovic
          </a>
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button
            className="md:hidden"
            aria-label="navigation toggle"
            onClick={() => setOverlayVisible(!overlayVisible)}
          >
            {overlayVisible ? (
              <div className="relative rotate-45">
                <div className="h-1 w-6 bg-black dark:bg-whiteish" />
                <div className="absolute top-0 h-1 w-6 rotate-90 bg-black dark:bg-whiteish" />
              </div>
            ) : (
              <div className="space-y-1">
                <div className="h-1 w-6 bg-black dark:bg-whiteish" />
                <div className="h-1 w-6 bg-black dark:bg-whiteish" />
                <div className="h-1 w-6 bg-black dark:bg-whiteish" />
              </div>
            )}
          </button>
          <div className="hidden space-x-4 md:flex md:text-2xl">
            <Nav routes={routes} links={links} />
          </div>
        </div>
      </nav>
      {overlayVisible && (
        <div className="border border-current pb-4 md:hidden ">
          <Nav routes={routes} links={links} />
        </div>
      )}
    </header>
  );
};

export default Header;
