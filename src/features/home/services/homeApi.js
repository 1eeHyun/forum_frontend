import axios from "@/api/axios";
import { postRoutes } from "@/constants/apiRoutes";

export function getHomePosts() {
  return axios.get(postRoutes.BASE); // /posts
}
