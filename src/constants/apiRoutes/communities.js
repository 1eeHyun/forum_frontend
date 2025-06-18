export const COMMUNITIES = {
  CREATE: { method: "POST", url: "/communities" },
  MY: { method: "GET", url: "/communities/my" },
  ALL: { method: "GET", url: "/communities" },

  DETAIL: (communityId) => ({ method: "GET", url: `/communities/${communityId}` }),
  JOIN: (communityId) => ({ method: "POST", url: `/communities/${communityId}/join` }),
  POSTS: (communityId) => ({ method: "GET", url: `/communities/${communityId}/posts` }),

  // Community posts endpoint
  CATEGORIES: (communityId) => ({
    method: "GET",
    url: `/communities/${communityId}/categories`,
  }),

  // Community categories endpoint
  ADD_CATEGORY: (communityId) => ({
    method: "POST",
    url: `/communities/${communityId}/categories`,
  }),

  GET_RULE: (communityId) => ({
    method: "GET",
    url: `/communities/${communityId}/rules`,
  }),

  // Community rules endpoint
  ADD_RULE: (communityId) => ({
    method: "POST",
    url: `/communities/${communityId}/rules`,
  }),

  // Community rules endpoint
  MANAGE: (communityId) => ({
    method: "GET",
    url: `/communities/${communityId}/manage`,
  }),

  // Community rules endpoint
  UPDATE_BANNER: (communityId) => ({
    method: "PUT",
    url: `/communities/${communityId}/banner`,
  }),

  // Update community profile image endpoint
  UPDATE_PROFILE_IMAGE: (communityId) => ({
    method: "PUT",
    url: `/communities/${communityId}/profile-image`,
  }),

  // Community new members endpoint
  NEW_MEMBERS: (communityId) => ({
    method: "GET",
    url: `/communities/${communityId}/members/new-members`,
  }),

  // Community online users endpoint
  ONLINE_USERS: (communityId) => ({
    method: "GET",
    url: `/communities/${communityId}/members/online-users`,
  }),

  // Community top posts by category endpoint
  TOP_POSTS_BY_CATEGORY: (communityId) => ({
    method: "GET",
    url: `/communities/${communityId}/top-posts-by-category`,
  }),
};
