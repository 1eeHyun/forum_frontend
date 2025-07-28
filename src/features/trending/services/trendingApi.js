export function getTrendingPosts() {
  return axios.get("/api/posts/trending");
}