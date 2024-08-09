export type Post = {
  slug: string;
  title: string;
  date: string;
  dateFormatted: string;
  content: string;
  coverImage?: string;
  excerpt: string;
  meta?: {
    ogImage?: string;
    description?: string;
  };
  discussion?: Record<string, string>;
};
