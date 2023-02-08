import Link from "next/link";

import { Post as PostType } from "@typing/post";

type Props = {
  posts: (Pick<PostType, "title" | "date" | "dateFormatted" | "slug"> & {
    excerpt?: string;
  })[];
  basePath: string;
};

const PostList = ({ posts, basePath }: Props) => {
  return (
    <section>
      <div className="mb-10 space-y-6">
        {posts.map(({ title, date, dateFormatted, excerpt, slug }) => (
          <div
            key={slug}
            className="mx-auto max-w-3xl bg-gray-100 p-4 pb-4 dark:bg-[#1e2022] dark:bg-opacity-80"
          >
            <h2 className="text-xl font-bold leading-snug md:text-3xl">
              <Link as={`/${basePath}/${slug}`} href={`/${basePath}/[slug]`}>
                <a className="hover:underline">{title}</a>
              </Link>
            </h2>
            <div className="text-sm">
              <time dateTime={date}>{dateFormatted}</time>
            </div>
            {excerpt && (
              <p className="mt-2 text-lg leading-relaxed">{excerpt}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PostList;
