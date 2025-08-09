export const TAG = {

  SUGGEST: { method: "GET", url: "/tags/suggest" },
  TOP: { method: "GET", url: "/tags/posts" },
  POSTS_BY_TAG: (tag) => ({ method: "GET", url: `/tags/${encodeURIComponent(tag)}/posts` }),
  REPLACE_TAGS: (postId) => ({ method: "PATCH", url: `/posts/${postId}/tags` }),
  ADD_TAGS: (postId) => ({ method: "POST", url: `/posts/${postId}/tags` }),
  REMOVE_TAGS: (postId) => ({ method: "DELETE", url: `/posts/${postId}/tags` }),
};