import { apiRequest } from "@/utils/apiRequest"; // Import the apiRequest function
import { COMMUNITIES } from "@/constants/apiRoutes/communities"; // Import the COMMUNITY API routes

// Create a new community
export const createCommunity = (form) =>
  apiRequest({ method: COMMUNITIES.CREATE.method, url: COMMUNITIES.CREATE.url, data: form });

// Get the details of a community by communityId
export const getCommunityDetail = (communityId) =>
  apiRequest(COMMUNITIES.DETAIL(communityId));

// Get posts from a specific community with parameters (e.g., sorting options, categories)
export const getCommunityPosts = (communityId, params) =>
  apiRequest({ ...COMMUNITIES.POSTS(communityId), params });

// Get the community's rules
export const getCommunityRules = (communityId) =>
  apiRequest(COMMUNITIES.ADD_RULE(communityId));

// Get the categories of a community
export const getCommunityCategories = (communityId) =>
  apiRequest(COMMUNITIES.CATEGORIES(communityId));

// Join a community by communityId
export const joinCommunity = (communityId) =>
  apiRequest(COMMUNITIES.JOIN(communityId));

// Add a rule to a community
export const addCommunityRule = (communityId, ruleData) =>
  apiRequest({ ...COMMUNITIES.ADD_RULE(communityId), data: ruleData });

// Update the banner of a community
export const updateCommunityBanner = (communityId, bannerData) =>
  apiRequest({ ...COMMUNITIES.UPDATE_BANNER(communityId), data: bannerData });

// Get the members of a community
export const getCommunityMembers = (communityId) => {
  return apiRequest({
    method: COMMUNITIES.MY.method,
    url: COMMUNITIES.MY.url,      
    params: { communityId },      
  });
};

// Get the online users of a community
export const fetchCommunityOnlineUsers = (communityId) => {
  return apiRequest({
    method: COMMUNITIES.ONLINE_USERS.method,
    url: COMMUNITIES.ONLINE_USERS(communityId).url,
  });
};

// Get the new members of a community
export const fetchCommunityNewMembers = (communityId) =>
  apiRequest(COMMUNITIES.NEW_MEMBERS(communityId));

// Get the top posts by category from a community
export const fetchCommunityTopPostsByCategory = (communityId) =>
  apiRequest(COMMUNITIES.POSTS(communityId));

// Common function to fetch different types of community information (posts, categories, members, etc.)
export const fetchCommunityInfo = async (communityId, infoType, params) => {
  try {
    switch(infoType) {
      case 'detail':
        const detailResponse = await apiRequest(COMMUNITIES.DETAIL(communityId));
        return detailResponse.data;
      case 'posts':
        const postsResponse = await apiRequest({ ...COMMUNITIES.POSTS(communityId), params });
        return postsResponse.data;
      case 'categories':
        const categoriesResponse = await apiRequest(COMMUNITIES.CATEGORIES(communityId));
        return categoriesResponse.data;
      case 'members':
        const membersResponse = await apiRequest({ method: "GET", url: `/communities/${communityId}/members` });
        return membersResponse.data;
      case 'online-users':
        const onlineUsersResponse = await apiRequest(COMMUNITIES.ONLINE_USERS(communityId));
        return onlineUsersResponse.data;
      case 'new-members':
        const newMembersResponse = await apiRequest(COMMUNITIES.NEW_MEMBERS(communityId));
        return newMembersResponse.data;
      default:
        throw new Error(`Unknown info type: ${infoType}`);
    }
  } catch (err) {
    console.error("Error fetching community info:", err);
    throw err;
  }
};


