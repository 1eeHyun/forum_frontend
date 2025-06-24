export const COMMUNITIES = {  
  CREATE: { method: "POST", url: "/communities" },
  MY: { method: "GET", url: "/communities/my" },
  ALL: { method: "GET", url: "/communities" },
  DETAIL: (communityId) => ({ method: "GET", url: `/communities/${communityId}` }),
  MANAGE: (communityId) => ({ method: "GET", url: `/communities/${communityId}/manage` }),

  // Join community
  JOIN: (communityId) => ({ method: "POST", url: `/communities/${communityId}/join` }),

  // Post
  POSTS: (communityId) => ({ method: "GET", url: `/communities/${communityId}/posts` }),
  
  TOP_POSTS_BY_CATEGORY: (communityId) => ({
    method: "GET",
    url: `/communities/${communityId}/top-posts-by-category`,
  }),

  // Category
  CATEGORIES: (communityId) => ({
    method: "GET",
    url: `/communities/${communityId}/categories`,
  }),
  ADD_CATEGORY: (communityId) => ({
    method: "POST",
    url: `/communities/${communityId}/categories`,
  }),
  DELETE_CATEGORY: (communityId, categoryId) => ({
    method: "DELETE",
    url: `/communities/${communityId}/categories/${categoryId}`,
  }),
  UPDATE_CATEGORY: (communityId, categoryId) => ({
    method: "PUT",
    url: `/communities/${communityId}/categories/${categoryId}`,
  }),

  // Description
  UPDATE_DESCRIPTION: (communityId) => ({
    method: "PATCH",
    url: `/communities/${communityId}/description`,
  }),
  
  // Rule
  RULES: (communityId) => ({ method: "GET", url: `/communities/${communityId}/rules` }),
  ADD_RULE: (communityId) => ({
    method: "POST",
    url: `/communities/${communityId}/rules`,
  }),

  // Member
  MEMBERS: (communityId) => ({ method: "GET", url: `/communities/${communityId}/members` }),
  NEW_MEMBERS: (communityId) => ({
    method: "GET",
    url: `/communities/${communityId}/members/new-members`,
  }),
  ONLINE_USERS: (communityId) => ({
    method: "GET",
    url: `/communities/${communityId}/members/online-users`,
  }),

  // Image
  UPDATE_BANNER_IMAGE: (communityId) => ({
    method: "PUT",
    url: `/communities/${communityId}/banner-image`,
  }),
  UPDATE_PROFILE_IMAGE: (communityId) => ({
    method: "PUT",
    url: `/communities/${communityId}/profile-image`,
  }),
};
