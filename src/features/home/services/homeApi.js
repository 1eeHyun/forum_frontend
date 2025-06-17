import axios from "@/api/axios";
import { POST_ROUTES } from "@/constants/apiRoutes";

export function getHomePosts() {
  return axios.get(POST_ROUTES.FETCH_PAGINATED.url);
}