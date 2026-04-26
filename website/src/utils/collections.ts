import { getCollection, type DataEntryMap } from "astro:content";

export async function getSortedCollection<C extends keyof DataEntryMap>(
  collection: C
) {
  return (await getCollection(collection)).sort((a, b) =>
    a.data.date > b.data.date ? -1 : 1
  );
}
