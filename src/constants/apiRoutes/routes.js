export const ROUTES = {
    HOME: "/",    
    SIGNUP: "/signup",
    LOGIN: "/login",
    POST: "/posts",
  
    POST_DETAIL: (postId) => `/post/${postId}`,
    EDIT_POST: (postId) => `/post/${postId}/edit`,
    POST_LIKE_USERS: (postId) => `/post/${postId}/likes`,
    BOOKMARKS: "/bookmarks",
  
    CREATE_POST: "/create-post",
    CREATE_COMMUNITY: "/create-community",
  
    PROFILE: (username) => `/profile/${username}`,
    PROFILE_EDIT: (username) => `/profile/${username}/edit`,
    PROFILE_EDIT_NICKNAME: (username) => `/profile/${username}/edit/nickname`,
    PROFILE_EDIT_USERNAME: (username) => `/profile/${username}/edit/username`,
    PROFILE_EDIT_BIO: (username) => `/profile/${username}/edit/bio`,
    PROFILE_EDIT_PICTURE: (username) => `/profile/${username}/edit/picture`,
  
    COMMUNITY: (communityId) => `/communities/${communityId}`,
    COMMUNITY_MANAGE: (communityId) => `/communities/${communityId}/manage`,
  
    POST_RELATED: (postId) => `/posts/${postId}/related`,
    MY_COMMUNITY_RECENT: "/posts/my-communities/recent",
    TOP_WEEKLY_POSTS: "/posts/top-weekly",
    RECENT_VIEWED_POSTS: "/recent",
  };
  