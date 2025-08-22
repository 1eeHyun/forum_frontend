import axios from "@/api/axios";

import { POSTS } from "@/constants/apiRoutes";
import { COMMENTS } from "@/constants/apiRoutes/comments";
import { AUTH } from "@/constants/apiRoutes/auth";
import { COMMUNITIES } from "@/constants/apiRoutes/communities";

// Post
export const createPost = (data) =>
  axios({ method: POSTS.CREATE.method, url: POSTS.CREATE.url, data });

export const getPostDetail = (postId) => {
  const { method, url } = POSTS.DETAIL(postId);
  return axios({ method, url });
};

export const updatePost = (postId, data) => {
  const { method, url } = POSTS.UPDATE(postId);
  return axios({ method, url, data });
};

export const deletePost = (postId) => {
  const { method, url } = POSTS.DELETE(postId);
  return axios({ method, url });
};

// Comment
export const createComment = (data) =>
  axios({ method: COMMENTS.CREATE.method, url: COMMENTS.CREATE.url, data });

export const replyComment = (data) =>
  axios({ method: COMMENTS.REPLY.method, url: COMMENTS.REPLY.url, data });

// Auth
export const fetchMe = () =>
  axios({ method: AUTH.ME.method, url: AUTH.ME.url });

// Community
export const getMyCommunities = () =>
  axios({ method: COMMUNITIES.MY.method, url: COMMUNITIES.MY.url });

export const getCategoriesByCommunityId = (communityId) => {
  const { method, url } = COMMUNITIES.CATEGORIES(communityId);
  return axios({ method, url });
};

// Unified Upload API for Image & Video
export const uploadMedia = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const { method, url } = POSTS.UPLOAD_FILE;

  return axios({ method, url, data: formData });
};

/**
 * Toggle hidden status of a post
 */
export async function togglePostHide(postId) {
  const { method, url } = POSTS.HIDE(postId);
  try {
    const res = await axios({ method, url });
    return res.data?.data ?? true;
  } catch (e) {
    console.error("Failed to toggle post hide:", e);
    throw e;
  }
}