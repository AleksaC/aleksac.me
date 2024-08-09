import { FC } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import Layout from "@/components/layout";
import { formatTitle } from "@/utils/title-formatter";

const NotFoundPage: FC = () => {
  const router = useRouter();

  return (
    <Layout>
      <Head>
        <title>{formatTitle("404")}</title>
      </Head>
      <div className="flex h-[80vh] items-center justify-center md:h-[60vh]">
        <div className="flex items-center">
          <h1 className="px-4 text-3xl font-medium md:text-4xl">404</h1>
          <div className="border-l border-black px-4 py-4 dark:border-whiteish">
            <h2 className="text-xl md:text-2xl">Page Not Found</h2>
            <div className="flex space-x-1">
              <button className="underline" onClick={() => router.back()}>
                Go back
              </button>
              <div>&middot;</div>
              <Link href="/">
                <a className="font-normal underline">Home</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
