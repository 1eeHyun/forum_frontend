import axios from "@/api/axios";
import { apiRequest } from "@/api/axios";
import { COMMUNITIES } from "@/constants/apiRoutes/communities";

// Community Online Users
export const fetchCommunityOnlineUsers = (communityId) =>
  axios(COMMUNITIES.ONLINE_USERS(communityId));

// Community new members
export const fetchCommunityNewMembers = (communityId) =>
  axios(COMMUNITIES.NEW_MEMBERS(communityId));

// Community top posts by category
export const fetchCommunityTopPostsByCategory = (communityId) => 
  axios(COMMUNITIES.TOP_POSTS_BY_CATEGORY(communityId));
