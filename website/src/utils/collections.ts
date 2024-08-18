import { getCollection, type AnyEntryMap } from "astro:content";

export async function getSortedCollection<C extends keyof AnyEntryMap>(
  collection: C
): ReturnType<typeof getCollection<C>> {
  return (await getCollection(collection)).sort((a, b) =>
    a.data.date > b.data.date ? -1 : 1
  );
}
