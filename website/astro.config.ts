import { defineConfig, passthroughImageService } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import tailwindcss from "@tailwindcss/vite";

type VitePlugins = NonNullable<
  ReturnType<typeof defineConfig>["vite"]
>["plugins"];

const plugins: VitePlugins = [tailwindcss()];

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
  image: {
    service: passthroughImageService(),
  },
  vite: {
    plugins,
    server: {
      watch: {
        ignored: ["**/.lighthouseci/**/*"],
      },
    },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
});
