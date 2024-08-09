import fs from "fs";
import { join } from "path";

import matter from "gray-matter";
import { parseISO, format } from "date-fns";

import { env, environments } from "@/config";

const blogPostsDirectory = join(process.cwd(), "_posts");
const tilPostsDirectory = join(process.cwd(), "_til");

class PostsFileService {
  baseDirectory: string;

  constructor(baseDirectory: string) {
    this.baseDirectory = baseDirectory;
  }

  getPostFiles() {
    return fs.readdirSync(this.baseDirectory);
  }

  getPostSlugs() {
    return this.getPostFiles().map((slug) => slug.replace(/\.md$/, ""));
  }

  async getPostBySlug(slug: string): Promise<Record<string, string>> {
    const fullPath = join(this.baseDirectory, `${slug}.md`);
    const fileContents = await fs.promises.readFile(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const dateFormatted = format(parseISO(data.date), "LLLL d, yyyy");

    return { slug, content, dateFormatted, ...data };
  }

  async getAllPosts() {
    const slugs = this.getPostSlugs();
    const posts = (
      await Promise.all(slugs.map((slug) => this.getPostBySlug(slug)))
    )
      .filter((post) => !post.draft || env !== environments.PROD)
      // sort posts by date in descending order
      .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

    return posts;
  }
}

export const BlogPostsService = new PostsFileService(blogPostsDirectory);
export const TilPostsService = new PostsFileService(tilPostsDirectory);
