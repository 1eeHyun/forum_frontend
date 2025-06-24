import { AUTH } from "./auth";
import { COMMENTS } from "./comments";
import { POSTS } from "./posts";
import { COMMUNITIES } from "./communities";
import { NOTIFICATIONS } from "./notifications";
import { ROUTES } from "./routes";
import { PROFILE } from "./profile";
import { CHAT } from "./chat";

// Named aliases for easier external usage
export const AUTH_ROUTES = AUTH;
export const COMMENT_ROUTES = COMMENTS;
export const POST_ROUTES = POSTS;
export const COMMUNITY_ROUTES = COMMUNITIES;
export const NOTIFICATION_ROUTES = NOTIFICATIONS;
export const APP_ROUTES = ROUTES;
export const CHAT_ROUTES = CHAT;

// Optional default object export (if needed)
export const API = {
  AUTH,
  COMMENTS,
  POSTS,
  COMMUNITIES,
  NOTIFICATIONS,
  ROUTES,
  PROFILE,
  CHAT,
};

// For direct named imports
export {
  AUTH,
  COMMENTS,
  POSTS,
  COMMUNITIES,
  NOTIFICATIONS,
  ROUTES,
  PROFILE,  
};
