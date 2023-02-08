import { FC, MutableRefObject, useRef } from "react";
import Head from "next/head";
import Link from "next/link";

import markdownStyles from "./markdown-styles.module.css";

import Layout from "@components/layout";
import { formatTitle } from "@utils/title-formatter";
import ProgressBar from "@components/progress-bar";
import ShareButtons from "@components/share-buttons";
import { Post as PostType } from "@typing/post";
import { useCodeCopyButtons } from "@hooks/copy-buttons";

const PostBody: FC<{ content: string }> = ({ content }) => {
  const postBody: MutableRefObject<HTMLDivElement | null> = useRef(null);

  useCodeCopyButtons(postBody as MutableRefObject<HTMLElement>);

  return (
    <div ref={postBody} className="mx-auto mt-8 max-w-2xl md:mt-16">
      <div
        className={markdownStyles["markdown"]}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

const PostFooter = ({
  discussion,
}: {
  discussion?: Record<string, string>;
}) => {
  return (
    <div className="mx-auto mb-14 flex max-w-3xl flex-col items-center space-y-2 border-t px-2 pt-4 text-center md:mt-10 md:px-4">
      <div className="flex items-center space-x-4">
        <div>Share:</div>
        <ShareButtons />
      </div>
      {discussion && (
        <p className="space-x-2">
          <span>Discuss:</span>
          {Object.entries(discussion).map(([name, link]) => (
            <a key={name} href={link}>
              {name}
            </a>
          ))}
        </p>
      )}
      <p>
        If you've come this far with the article you may want to know a thing or
        two{" "}
        <Link href="/">
          <a>about me</a>
        </Link>{" "}
        if you don't already. You can also read other{" "}
        <Link href="/blog">
          <a>blog posts</a>
        </Link>{" "}
        or about stuff{" "}
        <Link href="/til">
          <a>I've learned</a>
        </Link>{" "}
        recently.
      </p>
      <p className="pt-3">
        This website is{" "}
        <a href="https://github.com/AleksaC/aleksac.me">open source</a>. If
        you've come across a mistake please let me know there. For other types
        of feedback you can reach out to me through email or social-media.
      </p>
    </div>
  );
};

const Post: FC<{ post: PostType }> = ({ post }) => {
  const {
    title,
    excerpt,
    date,
    dateFormatted,
    coverImage,
    content,
    meta,
    discussion,
  } = post;

  const metaTags: Record<string, string> = {};

  const ogImageUrl = meta?.ogImage ? meta.ogImage : coverImage;
  if (ogImageUrl) {
    metaTags.ogImage = ogImageUrl;
  }

  const metaDescription = meta?.description ? meta.description : excerpt;
  if (metaDescription) {
    metaTags.description = metaDescription;
  }

  return (
    <Layout meta={metaTags}>
      <article>
        <Head>
          <title>{formatTitle(title)}</title>
        </Head>
        <ProgressBar />
        <h1 className="mb-8 text-center text-5xl font-bold leading-tight tracking-tighter md:text-left md:text-6xl md:leading-none">
          {title}
        </h1>
        <div className="mb-6 flex justify-between text-lg">
          <time dateTime={date}>{dateFormatted}</time>
          <ShareButtons />
        </div>
        {coverImage && (
          <img
            src={coverImage}
            alt={`Cover Image for ${title}`}
            className="h-auto w-full shadow-sm"
            width="2"
            height="1"
          />
        )}
        <PostBody content={content} />
        <PostFooter discussion={discussion} />
      </article>
    </Layout>
  );
};

export default Post;
