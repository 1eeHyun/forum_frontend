import axios from "@/api/axios";
import { API } from "@/constants/apiRoutes";

export const toggleCommentLike = async (commentId) => {
  const { method, url } = API.COMMENTS.LIKE(commentId);
  return axios({ method, url });
};

export const toggleCommentDislike = async (commentId) => {
  const { method, url } = API.COMMENTS.DISLIKE(commentId);
  return axios({ method, url });
};

export const getCommentLikeCount = async (commentId) => {
  const { method, url } = API.COMMENTS.LIKE_COUNT(commentId);
  const res = await axios({ method, url });
  return res.data.data;
};

export const getCommentDislikeCount = async (commentId) => {
  const { method, url } = API.COMMENTS.DISLIKE_COUNT(commentId);
  const res = await axios({ method, url });
  return res.data.data;
};

export const hasUserLiked = async (commentId) => {
  const { method, url } = API.COMMENTS.HAS_LIKED(commentId);
  const res = await axios({ method, url });
  return res.data.data;
};

export const hasUserDisliked = async (commentId) => {
  const { method, url } = API.COMMENTS.HAS_DISLIKED(commentId);
  const res = await axios({ method, url });
  return res.data.data;
};
