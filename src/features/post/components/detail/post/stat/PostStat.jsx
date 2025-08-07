import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, MessageSquare, Share2 } from "lucide-react";
import axios from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import useLoginModal from "@/hooks/auth/useLoginModal";
import { POSTS } from "@/constants/apiRoutes";

const REACTION = { LIKE: "LIKE", DISLIKE: "DISLIKE", NONE: "NONE" };

export default function PostStat({
  postId,
  initialLikeCount = 0,
  commentCount = 0,
  onCommentClick = () => {},
  onShare = () => {},
}) {
  const { isLoggedIn } = useAuth();
  const { open: openLoginModal } = useLoginModal();

  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [myReaction, setMyReaction] = useState(REACTION.NONE);

  // Fetch like count from server
  const refreshCount = async () => {
    try {
      const res = await axios({
        method: POSTS.LIKE_COUNT(postId).method,
        url: POSTS.LIKE_COUNT(postId).url,
      });
      setLikeCount(res.data?.data ?? 0);
    } catch (e) {
      console.error("Failed to fetch like count", e);
    }
  };

  // Fetch my reaction from server
  const refreshMyReaction = async () => {
    if (!isLoggedIn) {
      setMyReaction(REACTION.NONE);
      return;
    }
    try {
      const res = await axios({
        method: POSTS.GET_REACTION(postId).method,
        url: POSTS.GET_REACTION(postId).url,
      });
      const r = res.data?.data;
      setMyReaction(
        r === "LIKE" ? REACTION.LIKE : r === "DISLIKE" ? REACTION.DISLIKE : REACTION.NONE
      );
    } catch (e) {
      console.error("Failed to fetch reaction status", e);
      setMyReaction(REACTION.NONE);
    }
  };

  useEffect(() => {
    setLikeCount(initialLikeCount);
    refreshMyReaction();
    refreshCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, isLoggedIn]);

  // Handle like button click
  const handleLike = async () => {
    if (!isLoggedIn) return openLoginModal();
    setMyReaction((prev) => (prev === REACTION.LIKE ? REACTION.NONE : REACTION.LIKE));

    try {
      await axios({
        method: POSTS.LIKE(postId).method,
        url: POSTS.LIKE(postId).url,
      });
    } catch (err) {
      console.error("Like failed", err);
    } finally {
      await refreshCount();
      await refreshMyReaction();
    }
  };

  // Handle dislike button click
  const handleDislike = async () => {
    if (!isLoggedIn) return openLoginModal();
    setMyReaction((prev) => (prev === REACTION.DISLIKE ? REACTION.NONE : REACTION.DISLIKE));

    try {
      await axios({
        method: POSTS.DISLIKE(postId).method,
        url: POSTS.DISLIKE(postId).url,
      });
    } catch (err) {
      console.error("Dislike failed", err);
    } finally {
      await refreshCount();
      await refreshMyReaction();
    }
  };

  return (
    <div className="flex gap-3 mt-6 text-sm font-medium text-gray-700 dark:text-gray-300">
      {/* Like / Dislike */}
      <div className="flex items-center bg-gray-50 dark:bg-[#1f1f1f] rounded-full overflow-hidden shadow border border-gray-300 dark:border-gray-700">
        {/* Like button with full hover color */}
        <button
          onClick={handleLike}
          className={`px-3 py-2 transition-colors duration-200 ${
            myReaction === REACTION.LIKE
              ? "bg-orange-100 dark:bg-orange-900"
              : "hover:bg-orange-100 dark:hover:bg-orange-900"
          }`}
          title="Upvote"
        >
          <ArrowUp
            className={`w-4 h-4 ${
              myReaction === REACTION.LIKE ? "text-orange-500" : "text-gray-500"
            } transition`}
          />
        </button>

        <span className="px-2 text-base">{likeCount}</span>

        {/* Dislike button with full hover color */}
        <button
          onClick={handleDislike}
          className={`px-3 py-2 transition-colors duration-200 ${
            myReaction === REACTION.DISLIKE
              ? "bg-blue-100 dark:bg-blue-900"
              : "hover:bg-blue-100 dark:hover:bg-blue-900"
          }`}
          title="Downvote"
        >
          <ArrowDown
            className={`w-4 h-4 ${
              myReaction === REACTION.DISLIKE ? "text-blue-500" : "text-gray-500"
            } transition`}
          />
        </button>
      </div>

      {/* Comment */}
      <div
        onClick={onCommentClick}
        className="group flex items-center gap-1 px-4 py-2 bg-gray-50 dark:bg-[#1f1f1f] rounded-full shadow border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
      >
        <MessageSquare className="w-4 h-4 text-gray-500 group-hover:text-indigo-500 transition" />
        <span className="text-sm">{commentCount}</span>
      </div>

      {/* Share */}
      <div
        onClick={onShare}
        className="group flex items-center gap-1 px-4 py-2 bg-gray-50 dark:bg-[#1f1f1f] rounded-full shadow border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
      >
        <Share2 className="w-4 h-4 text-gray-500 group-hover:text-teal-500 transition" />
        <span className="text-sm">Share</span>
      </div>
    </div>
  );
}
