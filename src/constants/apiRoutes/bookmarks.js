export const BOOKMARKS = {
    TOGGLE: (postId) => ({ method: "POST", url: `/bookmarks/${postId}` }),
    CHECK: (postId) => ({ method: "GET", url: `/bookmarks/${postId}/check` }),
    MY: { method: "GET", url: "/bookmarks" },
}