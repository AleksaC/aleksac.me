import fs from "fs";

import Head from "next/head";
import RSS from "rss";

import Layout from "@components/layout";
import socialMedia from "@constants/social-media";
import { formatTitle } from "@utils/title-formatter";
import { BlogPostsService, TilPostsService } from "@services/posts";
import { GENERATE_RSS, GENERATE_SITEMAP, WEBSITE_URL } from "@config";
import { DESCRIPTION } from "@constants/meta";

const Index = () => {
  return (
    <Layout>
      <Head>
        <title>{formatTitle("About")}</title>
        <link rel="canonical" href={`${WEBSITE_URL}/`} />
      </Head>
      <div className="mx-auto max-w-4xl pb-10 md:pb-0 xl:pb-10 2xl:pb-0">
        <div>
          <h3 className="mb-4">About me</h3>
          <p>
            This is a test Hi, I'm Aleksa Ćuković, a software engineer from
            Montenegro. I enjoy solving problems and building things. I
            especially like building stuff that I can use myself, hence I prefer
            to work on infrastructure and developer tooling. When I'm not
            working I'm probably hanging out with my friends and family, lifting
            weights, playing basketball or playing EU4.
            <br />
            <br />
            Not long ago my main interest was AI/ML. My main contribution to the
            field is a large quantity of memes I made and posted on my meme{" "}
            <a href="https://www.facebook.com/artificialintelligencememes">
              page
            </a>{" "}
            and <a href="https://twitter.com/ai_memes">twitter account</a> which
            were among the first and most popular accounts of that kind at the
            time.
          </p>
        </div>
        <div>
          <h3 className="mt-8 mb-4">About my work</h3>
          <p>
            Currently I'm getting paid to build infrastructure on AWS and
            Kubernetes. If you're doing the same but would rather spend more
            time focusing on your business, hit me up, I might be able to help
            with that.
            <br />
            <br />
            When it comes to coding I'm most comfortable with
            JavaScript/TypeScript and Python, but lately I've been picking up a
            bit of Go and Rust. I'm passionate about open source and have made
            many small contributions to various projects and open sourced some
            of my own work. My OSS work is available on my{" "}
            <a href={socialMedia.GITHUB.link}>GitHub account</a>. For more info
            about my career check out my hopefully only slightly outdated{" "}
            <a href="/resume.pdf">resume</a>.
          </p>
        </div>
        <div>
          <h3 className="mt-8 mb-4">About this website</h3>
          <p>
            Appart from being a central part of my online presence, my goal with
            this website is to write about stuff I find important and
            interesting. I've noticed a widening gap between my experiences,
            especially as a software developer, and stuff that's being written
            about, so I'm trying to close that gap. When it comes to tech behind
            the website, it's a static site built with Next.js and hosted on
            Cloudflare Pages.
          </p>
        </div>
        <div>
          <h3 className="mt-8 mb-4">Contact</h3>
          <p>
            If you'd like to reach out feel free to send me an email at{" "}
            <a href="mailto:hello@aleksac.me">hello@aleksac.me</a>. Since I've
            only had positive experience with people reaching out, my DMs are
            open and you can contact me on{" "}
            <a href={socialMedia.TWITTER.link}>twitter</a> and{" "}
            <a href={socialMedia.INSTAGRAM.link}>instagram</a>.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

export async function getStaticProps() {
  const [blogPosts, tilPosts] =
    GENERATE_RSS || GENERATE_SITEMAP
      ? await Promise.all([
          BlogPostsService.getAllPosts(),
          TilPostsService.getAllPosts(),
        ])
      : [[], []];

  if (GENERATE_RSS) {
    const feed = new RSS({
      title: "Aleksa Cukovic",
      description: DESCRIPTION,
      site_url: `${WEBSITE_URL}`,
      feed_url: `${WEBSITE_URL}/feed.xml`,
    });

    for (const post of blogPosts) {
      feed.item({
        title: post.title,
        url: `${WEBSITE_URL}/blog/${post.slug}`,
        date: post.date,
        description: post.excerpt,
      });
    }

    for (const post of tilPosts) {
      feed.item({
        title: post.title,
        url: `${WEBSITE_URL}/til/${post.slug}`,
        date: post.date,
        description: post.excerpt,
      });
    }

    fs.writeFileSync("./public/feed.xml", feed.xml());
  }

  if (GENERATE_SITEMAP) {
    const paths = [
      "",
      "blog",
      "til",
      ...blogPosts.map((post) => `blog/${post.slug}`),
      ...tilPosts.map((post) => `til/${post.slug}`),
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${paths
              .map(
                (path) => `
                    <url>
                        <loc>${`${WEBSITE_URL}/${path}`}</loc>
                    </url>
                `,
              )
              .join("")}
        </urlset>
    `;

    fs.writeFileSync("./public/sitemap.xml", sitemap);
  }

  return {
    props: {},
  };
}
