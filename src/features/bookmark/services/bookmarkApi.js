import axios from "@/api/axios";
import { BOOKMARKS } from "@/constants/apiRoutes/bookmarks";

// Toggle bookmark for a post
export async function toggleBookmark(postId) {
  const { method, url } = BOOKMARKS.TOGGLE(postId);
  return await axios({ method, url });
}

// Check if a post is bookmarked by current user
export async function checkIsBookmarked(postId) {
  const { method, url } = BOOKMARKS.CHECK(postId);
  return await axios({ method, url });
}

// Get all bookmarks of current user
export async function getMyBookmarks() {
  const { method, url } = BOOKMARKS.MY;
  return await axios({ method, url });
}
