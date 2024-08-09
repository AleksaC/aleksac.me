import { FC } from "react";
import Head from "next/head";

import Layout from "@/components/layout";
import { formatTitle } from "@/utils/title-formatter";
import { Post as PostType } from "@/types/post";
import { TilPostsService } from "@/services/posts";
import PostList from "@/components/post-list";
import Intro from "@/components/intro";
import { WEBSITE_URL } from "@/config";

type Props = {
  posts: PostType[];
};

const Index: FC<Props> = ({ posts }) => {
  return (
    <Layout>
      <Head>
        <title>{formatTitle("TIL")}</title>
        <link rel="canonical" href={`${WEBSITE_URL}/til/`} />
      </Head>
      <Intro title={"Today I Learned"}>
        TIL stands for today I learned. Here I'll share small nuggets of
        knowledge as I collect them. Most of the stuff here is in the form of
        advice or reusable snippets and can be digested in a couple of minutes.
        <br />
        <br />
        As with blog, majority of the posts here are related to software
        development and tech in general. Unlike blog posts, many posts here
        present no new information but rather highlight a piece of information
        that may be less prominent in other sources (e.g. documentation of a
        project).
      </Intro>
      <PostList posts={posts} basePath={"til"} />
    </Layout>
  );
};

export default Index;

export const getStaticProps = async () => {
  const posts = await TilPostsService.getAllPosts();

  return {
    props: {
      posts,
    },
  };
};
