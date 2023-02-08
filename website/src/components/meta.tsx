import Head from "next/head";

const Meta = ({ tags }: { tags: Record<string, string> }) => {
  return (
    <Head>
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      {Object.entries(tags).map(([name, content]) => (
        <meta key={name} name={name} content={content} />
      ))}
    </Head>
  );
};

export default Meta;
