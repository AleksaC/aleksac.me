import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

const plugins = [];

if (process.env.ANALYZE && process.env.ANALYZE.toLowerCase() === "true") {
  const { visualizer } = await import("rollup-plugin-visualizer");

  plugins.push(
    visualizer({
      open: true,
      gzipSize: true,
    })
  );
}

// https://astro.build/config
export default defineConfig({
  trailingSlash: "always",
  markdown: {
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  },
  vite: {
    plugins,
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
