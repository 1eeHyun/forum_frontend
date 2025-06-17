const communityRoutes = {
    BASE: "/communities",
    DETAIL: (id) => `/communities/${id}`,
    DESCRIPTION: (id) => `/communities/${id}/description`,
    RULES: (id) => `/communities/${id}/rules`,
  };
  
  export default communityRoutes;
  