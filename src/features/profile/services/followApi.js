import axios from "@/api/axios";

export const followUserToggle = (username) =>
  axios.post(`follows/${username}`);

export const checkIsFollowing = (username) =>
  axios.get(`follows/${username}/is-following`);
