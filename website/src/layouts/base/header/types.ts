import type { AstroComponentFactory } from "astro/runtime/server/index.js";

export type Route = {
  name: string;
  href: string;
};

export type IconLink = {
  icon: AstroComponentFactory;
  link: string;
};
