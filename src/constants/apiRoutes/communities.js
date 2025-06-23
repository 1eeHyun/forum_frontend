export const COMMUNITIES = {  
  CREATE: { method: "POST", url: "/api/communities" },
  MY: { method: "GET", url: "/api/communities/my" },
  ALL: { method: "GET", url: "/api/communities" },
  DETAIL: (communityId) => ({ method: "GET", url: `/api/communities/${communityId}` }),
  MANAGE: (communityId) => ({ method: "GET", url: `/api/communities/${communityId}/manage` }),

  // Join community
  JOIN: (communityId) => ({ method: "POST", url: `/api/communities/${communityId}/join` }),

  // Post
  POSTS: (communityId) => ({ method: "GET", url: `/api/communities/${communityId}/posts` }),
  
  TOP_POSTS_BY_CATEGORY: (communityId) => ({
    method: "GET",
    url: `/api/communities/${communityId}/top-posts-by-category`,
  }),

  // Category
  CATEGORIES: (communityId) => ({
    method: "GET",
    url: `/api/communities/${communityId}/categories`,
  }),
  ADD_CATEGORY: (communityId) => ({
    method: "POST",
    url: `/api/communities/${communityId}/categories`,
  }),
  DELETE_CATEGORY: (communityId, categoryId) => ({
    method: "DELETE",
    url: `/api/communities/${communityId}/categories/${categoryId}`,
  }),
  UPDATE_CATEGORY: (communityId, categoryId) => ({
    method: "PUT",
    url: `/api/communities/${communityId}/categories/${categoryId}`,
  }),

  // Description
  UPDATE_DESCRIPTION: (communityId) => ({
    method: "PATCH",
    url: `/api/communities/${communityId}/description`,
  }),
  
  // Rule
  RULES: (communityId) => ({ method: "GET", url: `/api/communities/${communityId}/rules` }),
  ADD_RULE: (communityId) => ({
    method: "POST",
    url: `/api/communities/${communityId}/rules`,
  }),

  // Member
  MEMBERS: (communityId) => ({ method: "GET", url: `/api/communities/${communityId}/members` }),
  NEW_MEMBERS: (communityId) => ({
    method: "GET",
    url: `/api/communities/${communityId}/members/new-members`,
  }),
  ONLINE_USERS: (communityId) => ({
    method: "GET",
    url: `/api/communities/${communityId}/members/online-users`,
  }),

  // Image
  UPDATE_BANNER_IMAGE: (communityId) => ({
    method: "PUT",
    url: `/api/communities/${communityId}/banner-image`,
  }),
  UPDATE_PROFILE_IMAGE: (communityId) => ({
    method: "PUT",
    url: `/api/communities/${communityId}/profile-image`,
  }),
};
