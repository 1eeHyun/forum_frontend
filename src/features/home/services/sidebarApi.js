import axios from "@/api/axios";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { POSTS } from "@/constants/apiRoutes/posts";

export const fetchRecentPostsFromMyCommunities = () =>
  axios(ROUTES.MY_COMMUNITY_RECENT);

export const fetchTopPostsThisWeek = () =>
  axios.get(POSTS.TOP_WEEKLY.url);

export const fetchRecentViewedPosts = () =>
  axios(POSTS.RECENTLY_VIEWED.url);

export const fetchRelatedPosts = (postId) =>
  axios(ROUTES.POST_RELATED(postId));  
