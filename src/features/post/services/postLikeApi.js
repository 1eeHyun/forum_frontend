import axios from "@/api/axios";
import { API } from "@/constants/api";

export const togglePostLike = async (postId) => {
  const { method, url } = API.POSTS.LIKE(postId);
  return axios({ method, url });
};

export const getPostLikeCount = async (postId) => {
  const { method, url } = API.POSTS.LIKE_COUNT(postId);
  const res = await axios({ method, url });
  return res.data.data;
};

export const getPostLikeUsers = async (postId) => {
  const { method, url } = API.POSTS.LIKE_USERS(postId);
  const res = await axios({ method, url });
  return res.data.data;
};

export const getPostReaction = async (postId) => {
  const { method, url } = POSTS.GET_REACTION(postId);
  const res = await axios({ method, url });
  return res.data.data; // "LIKE", "DISLIKE", or null
};
