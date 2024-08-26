import { WEBSITE_URL } from "@/config";
import { getSortedCollection } from "@/utils/collections";

export async function GET() {
  const blogPosts = await getSortedCollection("blog");
  const tilPosts = await getSortedCollection("til");

  const paths = [
    "",
    "blog/",
    "til/",
    ...blogPosts.map((post) => `blog/${post.slug}/`),
    ...tilPosts.map((post) => `til/${post.slug}/`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${paths
            .map(
              (path) => `
                  <url>
                      <loc>${`${WEBSITE_URL}/${path}`}</loc>
                  </url>
              `
            )
            .join("")}
      </urlset>
  `;

  return new Response(sitemap);
}
