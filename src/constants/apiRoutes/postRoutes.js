const postRoutes = {
    BASE: "/posts",
    DETAIL: (id) => `/posts/${id}`,
    LIKE: (id) => `/posts/${id}/like`,
  };
  
  export default postRoutes;
  