import { getPublishedPosts } from "@/lib/content";
import { SearchModalClient } from "@/components/search-modal-client";

export default async function InterceptedSearchModal() {
  const posts = await getPublishedPosts(false);
  return <SearchModalClient posts={posts} />;
}
