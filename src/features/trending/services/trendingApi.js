import axios from "@/api/axios";
import { POSTS } from "@/constants/apiRoutes/posts";

export function getTrendingPosts() {
  return axios.get(POSTS.TRENDINGPOSTS.url);
}

export const getTrendingSidebar = () => {
  return axios.get(POSTS.TRENDING_SIDEBAR.url);
};
