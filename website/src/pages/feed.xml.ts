import RSS from "rss";
import { WEBSITE_URL } from "@/config";
import { DESCRIPTION } from "@/constants/meta";
import { getSortedCollection } from "@/utils/collections";

export async function GET() {
  const feed = new RSS({
    title: "Aleksa Cukovic",
    description: DESCRIPTION,
    site_url: `${WEBSITE_URL}`,
    feed_url: `${WEBSITE_URL}/feed.xml`,
  });

  const blogPosts = await getSortedCollection("blog");
  const tilPosts = await getSortedCollection("til");

  for (const post of blogPosts) {
    feed.item({
      title: post.data.title,
      url: `${WEBSITE_URL}/blog/${post.slug}`,
      date: post.data.date,
      description: post.data.description ?? "",
    });
  }

  for (const post of tilPosts) {
    feed.item({
      title: post.data.title,
      url: `${WEBSITE_URL}/til/${post.slug}`,
      date: post.data.date,
      description: post.data.description || "",
    });
  }

  return new Response(feed.xml());
}
