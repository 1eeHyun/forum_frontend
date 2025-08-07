import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, MessageSquare, Share2, X } from "lucide-react";
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
  // onShare prop no longer required; handled inside with modal copy
}) {
  const { isLoggedIn } = useAuth();
  const { open: openLoginModal } = useLoginModal();

  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [myReaction, setMyReaction] = useState(REACTION.NONE);

  // Share modal state
  const [shareOpen, setShareOpen] = useState(false);

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

  // Handle share click: copy URL and open modal
  const handleShare = async () => {
    try {
      // Build share URL: current location + ?postId=...
      const url = new URL(window.location.href);
      url.searchParams.set("postId", String(postId));
      await navigator.clipboard.writeText(url.toString());

      // Open modal feedback
      setShareOpen(true);
    } catch (err) {
      console.error("Copy to clipboard failed", err);
      // Fallback: still open modal with different message, if you want
      setShareOpen(true);
    }
  };

  // Auto-close share modal after 1.5s
  useEffect(() => {
    if (!shareOpen) return;
    const t = setTimeout(() => setShareOpen(false), 1500);
    return () => clearTimeout(t);
  }, [shareOpen]);

  // Close modal on ESC key
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setShareOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
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
          onClick={handleShare}
          className="group flex items-center gap-1 px-4 py-2 bg-gray-50 dark:bg-[#1f1f1f] rounded-full shadow border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
        >
          <Share2 className="w-4 h-4 text-gray-500 group-hover:text-teal-500 transition" />
          <span className="text-sm">Share</span>
        </div>
      </div>

      {/* Share Modal */}
      {shareOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          onClick={() => setShareOpen(false)} // close when clicking backdrop
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Modal Card */}
          <div
            className="relative z-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-full max-w-xs"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* Close button */}
            <button
              onClick={() => setShareOpen(false)}
              className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Modal body */}
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-teal-500" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Link copied to clipboard
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You can share it anywhere now.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
