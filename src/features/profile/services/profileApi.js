import axios from "@/api/axios";
import { PROFILE } from "@/constants/apiRoutes/profile";

// retrieve user profile
export const fetchProfile = (username) => {
  const { method, url } = PROFILE.GET(username);
  return axios({ method, url });
};

// Update user nickname
export const updateNickname = (username, nickname) => {
  const { method, url } = PROFILE.UPDATE_NICKNAME(username);
  return axios({ method, url, data: { nickname } });
};

// Update user username
export const updateUsername = (username, newUsername) => {
  const { method, url } = PROFILE.UPDATE_USERNAME(username);
  return axios({ method, url, data: { username: newUsername } });
};

// Update user bio
export const updateBio = (username, bio) => {
  const { method, url } = PROFILE.UPDATE_BIO(username);
  return axios({ method, url, data: { bio } });
};

// Update user profile image
export const updateProfileImage = (username, formData) => {
  const { url } = PROFILE.UPDATE_IMAGE(username);
  return axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const fetchProfilePosts = (username, sort = "newest", page = 0, size = 10) => {
  const { url } = PROFILE.GET_POSTS(username);
  return axios.get(url, { params: { sort, page, size } });
};

