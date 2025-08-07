import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, MessageCircle, Share } from "lucide-react";
import axios from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import useLoginModal from "@/hooks/auth/useLoginModal";
import { POSTS } from "@/constants/apiRoutes";

const REACTION = { LIKE: "LIKE", DISLIKE: "DISLIKE", NONE: "NONE" };

export default function PostActions({
  post,
  onLike = () => {},
  onDislike = () => {},
  onCommentClick = () => {},
  iconSize = 18,
  className = "",
}) {
  const { isLoggedIn } = useAuth();
  const { open: openLoginModal } = useLoginModal();

  const [likeCount, setLikeCount] = useState(0);
  const [myReaction, setMyReaction] = useState(REACTION.NONE);

  const refreshCount = async () => {
    try {
      const res = await axios({
        method: POSTS.LIKE_COUNT(post.id).method,
        url: POSTS.LIKE_COUNT(post.id).url,
      });
      setLikeCount(res.data?.data ?? 0);
    } catch (e) {
      console.error("Failed to fetch like count", e);
    }
  };

  const refreshMyReaction = async () => {
    if (!isLoggedIn) {
      setMyReaction(REACTION.NONE);
      return;
    }
    try {
      const res = await axios({
        method: POSTS.GET_REACTION(post.id).method,
        url: POSTS.GET_REACTION(post.id).url,
      });
      const r = res.data?.data;
      setMyReaction(r === "LIKE" ? REACTION.LIKE : r === "DISLIKE" ? REACTION.DISLIKE : REACTION.NONE);
    } catch (e) {
      console.error("Failed to fetch my reaction", e);
      setMyReaction(REACTION.NONE);
    }
  };

  useEffect(() => {
    refreshMyReaction();
    refreshCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id, isLoggedIn]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) return openLoginModal();
    
    setMyReaction((prev) => (prev === REACTION.LIKE ? REACTION.NONE : REACTION.LIKE));

    try {
      await axios({        
        method: POSTS.LIKE(post.id).method,
        url: POSTS.LIKE(post.id).url,
      });
      onLike();
    } catch (err) {
      console.error("Like failed", err);
    } finally {      
      refreshCount();      
      refreshMyReaction();
    }
  };

  const handleDislike = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) return openLoginModal();

    setMyReaction((prev) => (prev === REACTION.DISLIKE ? REACTION.NONE : REACTION.DISLIKE));

    try {
      await axios({
        method: POSTS.DISLIKE(post.id).method,
        url: POSTS.DISLIKE(post.id).url,
      });
      onDislike();
    } catch (err) {
      console.error("Dislike failed", err);
    } finally {
      refreshCount();
      refreshMyReaction();
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("postId", post.id);
      await navigator.clipboard.writeText(url.toString());
    } catch (err) {
      console.error("Copy to clipboard failed", err);
    }
  };

  return (
    <div
      className={`ml-4 flex gap-3 mt-2 my-2 text-sm font-medium text-gray-700 dark:text-gray-300 ${className}`}
    >
      {/* Vote */}
      <div className="flex items-center bg-gray-50 dark:bg-[#1f1f1f] rounded-full overflow-hidden shadow border border-gray-300 dark:border-gray-700">
        <button
          onClick={handleLike}
          className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          title="Upvote"
        >
          <ArrowUp
            className={`w-4 h-4 ${
              myReaction === REACTION.LIKE ? "text-orange-500" : "text-gray-500"
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
              myReaction === REACTION.DISLIKE ? "text-blue-500" : "text-gray-500"
            } transition`}
          />
        </button>
      </div>

      {/* Comment */}
      <button
        onClick={onCommentClick}
        className="group flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-[#1f1f1f] rounded-full shadow border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <MessageCircle
          size={iconSize - 2}
          className="text-gray-500 group-hover:text-indigo-500"
        />
        <span>{post.commentCount || 0}</span>
      </button>

      {/* Share */}
      <button
        onClick={handleShare}
        className="group flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-[#1f1f1f] rounded-full shadow border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <Share
          size={iconSize}
          className="text-gray-500 group-hover:text-teal-500"
        />
        <span>Share</span>
      </button>
    </div>
  );
}
