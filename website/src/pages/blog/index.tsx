import Head from "next/head";

import Layout from "@components/layout";
import { BlogPostsService } from "@services/posts";
import { Post } from "@typing/post";
import { formatTitle } from "@utils/title-formatter";
import PostList from "@components/post-list";
import Intro from "@components/intro";
import { WEBSITE_URL } from "@config";

type Props = {
  posts: Post[];
};

const Index = ({ posts }: Props) => {
  return (
    <Layout>
      <Head>
        <title>{formatTitle("Blog")}</title>
        <link rel="canonical" href={`${WEBSITE_URL}/blog/`} />
      </Head>
      <Intro title={"Blog"}>
        This blog is an attempt to reshape my notes and ideas into somtehing
        that can be helpful to others, as well as clear enough so that I can get
        useful feedback on it and maybe even good enough to get me some clout.
        <br />
        <br />
        Majority of the posts here are about software engineering. While I don't
        have a target audience most of the stuff should resonate with somewhat
        experienced software engineers.
        <br />
        <br />
        When it comes to post titles and descriptions I try to word them in a
        way that I think would maximize engagement while not meaningfully
        misrepresenting the content.
      </Intro>
      <PostList posts={posts} basePath={"blog"} />
    </Layout>
  );
};

export default Index;

export const getStaticProps = async () => {
  const posts = await BlogPostsService.getAllPosts();

  return {
    props: { posts },
  };
};
