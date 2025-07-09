import { useState, useEffect } from "react";
import {
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Share2,
} from "lucide-react";
import axios from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import useLoginModal from "@/hooks/auth/useLoginModal";
import { POST_ROUTES } from "@/constants/apiRoutes";

export default function PostStat({
  postId,
  initialLikeCount,
  commentCount,
  onCommentClick,
  onShare,
}) {
  const { isLoggedIn } = useAuth();
  const { open: openLoginModal } = useLoginModal();

  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  useEffect(() => {
    // Optionally fetch user vote status if API provides it
    // For now assume false on mount
    setLiked(false);
    setDisliked(false);
  }, [postId]);

  const handleLike = async () => {
    if (!isLoggedIn) return openLoginModal();

    try {
      await axios({
        method: POST_ROUTES.LIKE(postId).method,
        url: POST_ROUTES.LIKE(postId).url,
      });

      // Toggle logic
      if (liked) {
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
        if (disliked) setDisliked(false);
      }
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleDislike = async () => {
    if (!isLoggedIn) return openLoginModal();

    try {
      await axios({
        method: POST_ROUTES.DISLIKE(postId).method,
        url: POST_ROUTES.DISLIKE(postId).url,
      });

      // Toggle logic
      if (disliked) {
        setDisliked(false);
        setLikeCount((prev) => prev + 1);
      } else {
        setDisliked(true);
        setLikeCount((prev) => prev - 1);
        if (liked) setLiked(false);
      }
    } catch (err) {
      console.error("Dislike failed", err);
    }
  };

  return (
    <div className="flex gap-3 mt-6 text-sm font-medium text-gray-700 dark:text-gray-300">
      {/* Like / Dislike */}
      <div className="flex items-center bg-gray-50 dark:bg-[#1f1f1f] rounded-full overflow-hidden shadow border border-gray-300 dark:border-gray-700">
        <button
          onClick={handleLike}
          className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          title="Upvote"
        >
          <ArrowUp
            className={`w-4 h-4 ${
              liked ? "text-orange-500" : "text-gray-500"
            } transition`}
          />
        </button>
        <span className="px-2 text-base">{likeCount}</span>
        <button
          onClick={handleDislike}
          className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          title="Downvote"
        >
          <ArrowDown
            className={`w-4 h-4 ${
              disliked ? "text-blue-500" : "text-gray-500"
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
