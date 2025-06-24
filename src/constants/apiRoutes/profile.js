export const PROFILE = {
    GET: (username) => ({ method: "GET", url: `/profiles/${username}` }),
    UPDATE_NICKNAME: (username) => ({ method: "POST", url: `/profiles/${username}/nickname` }),
    UPDATE_USERNAME: (username) => ({ method: "POST", url: `/profiles/${username}/username` }),
    UPDATE_BIO: (username) => ({ method: "POST", url: `/profiles/${username}/bio` }),
    UPDATE_IMAGE: (username) => ({ method: "POST", url: `/profiles/${username}/image` }),
    GET_POSTS: (username) => ({ method: "GET", url: `/profiles/${username}/posts` }),
  };
  