export const PROFILE = {
    GET: (username) => ({ method: "GET", url: `/profiles/${username}` }),
    UPDATE_NICKNAME: (username) => ({ method: "POST", url: `/profiles/${username}/nickname` }),
    UPDATE_USERNAME: (username) => ({ method: "POST", url: `/profiles/${username}/username` }),
    UPDATE_BIO: (username) => ({ method: "POST", url: `/profiles/${username}/bio` }),
    UPDATE_IMAGE: (username) => ({ method: "POST", url: `/profiles/${username}/image` }),
    GET_POSTS: (username) => ({ method: "GET", url: `/profiles/${username}/posts` }),
    GET_COMMUNITIES: (username) => ({ method: "GET", url: `/profiles/${username}/communities` }),
  
    GET_TOP_POSTS: (username) => ({
      method: "GET",
      url: `/profiles/${username}/posts?sort=top&page=0&size=5`,
    }),
    GET_LATEST_POSTS: (username) => ({
      method: "GET",
      url: `/profiles/${username}/posts?sort=newest&page=0&size=5`,
    }),
};
  