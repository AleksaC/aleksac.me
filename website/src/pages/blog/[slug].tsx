// TODO: try finding a way to only include if the page contains code blocks
import "highlight.js/styles/github-dark-dimmed.css";

import { FC } from "react";
import Head from "next/head";

import PostComponent from "@/components/post";
import markdownToHtml from "@/lib/markdownToHtml";
import { Post as PostType } from "@/types/post";
import { BlogPostsService } from "@/services/posts";
import { WEBSITE_URL } from "@/config";

const Post: FC<{ post: PostType }> = ({ post }) => {
  return (
    <>
      <Head>
        <link rel="canonical" href={`${WEBSITE_URL}/blog/${post.slug}`} />
      </Head>
      <PostComponent post={post} />
    </>
  );
};

export default Post;

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const post = await BlogPostsService.getPostBySlug(params.slug);
  const content = await markdownToHtml(post.content || "");

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const slugs = BlogPostsService.getPostSlugs();

  return {
    paths: slugs.map((slug) => {
      return {
        params: {
          slug,
        },
      };
    }),
    fallback: false,
  };
}
