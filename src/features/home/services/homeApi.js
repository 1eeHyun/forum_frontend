import axios from "@/api/axios";
import { POSTS } from "@/constants/apiRoutes";

export function getHomePosts() {
  return axios.get(POSTS.FETCH_PAGINATED.url);
}