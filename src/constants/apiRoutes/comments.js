export const COMMENTS = {
    CREATE: { method: "POST", url: "/comments" },
    REPLY: { method: "POST", url: "/comments/reply" },

    LIKE: (id) => ({ method: "post", url: `/comments/${id}/likes` }),
    DISLIKE: (id) => ({ method: "post", url: `/comments/${id}/dislikes` }),
    LIKE_COUNT: (id) => ({ method: "get", url: `/comments/${id}/likes/count` }),
    DISLIKE_COUNT: (id) => ({ method: "get", url: `/comments/${id}/dislikes/count` }),
    HAS_LIKED: (id) => ({ method: "get", url: `/comments/${id}/likes/me` }),
    HAS_DISLIKED: (id) => ({ method: "get", url: `/comments/${id}/dislikes/me` }),
};
  