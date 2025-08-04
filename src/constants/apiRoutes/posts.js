export const POSTS = {

    FETCH_PAGINATED: { method: "GET", url: "/posts" },
    CREATE: { method: "POST", url: "/posts" },
    UPLOAD_FILE: { method: "POST", url: "/posts/upload" },

    TRENDINGPOSTS: { method: "GET", url: "/posts/trending" },
    TRENDING_SIDEBAR: { method: "GET", url: "/trending/sidebar" },
  
    DETAIL: (postId) => ({ method: "GET", url: `/posts/${postId}` }),
    UPDATE: (postId) => ({ method: "PUT", url: `/posts/${postId}` }),
    DELETE: (postId) => ({ method: "DELETE", url: `/posts/${postId}` }),
  
    LIKE: (postId) => ({ method: "POST", url: `/posts/${postId}/likes` }),
    LIKE_COUNT: (postId) => ({ method: "GET", url: `/posts/${postId}/likes` }),
    LIKE_USERS: (postId) => ({ method: "GET", url: `/posts/${postId}/likes/users` }),
  
    BOOKMARK: (postId) => ({ method: "POST", url: `/posts/${postId}/bookmark` }),
    REPORT: (postId) => ({ method: "POST", url: `/posts/${postId}/report` }),
    HIDE: (postId) => ({ method: "POST", url: `/posts/${postId}/hide-toggle` }),
  
    RELATED: (postId) => ({ method: "GET", url: `/posts/${postId}/related` }),
    MY_COMMUNITY_RECENT: { method: "GET", url: "/posts/my-communities/recent" },
    TOP_WEEKLY: { method: "GET", url: "/posts/top-weekly" },
    RECENTLY_VIEWED: { method: "GET", url: "/posts/recent" },
  };
  