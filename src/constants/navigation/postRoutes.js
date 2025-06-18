export const POST_NAVIGATION = {
    withPostId: (currentPath, postId) => `${currentPath}?postId=${postId}`,
    detail: (id) => `/posts/${id}`,
    edit: (id) => `/posts/${id}/edit`,
};