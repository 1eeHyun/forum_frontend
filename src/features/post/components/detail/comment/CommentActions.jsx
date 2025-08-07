import { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";
import axios from "@/api/axios";
import { COMMENTS } from "@/constants/apiRoutes/comments";
import { useAuth } from "@/context/AuthContext";
import useLoginModal from "@/hooks/auth/useLoginModal";

export default function CommentActions({
  commentId,
  initialLiked = false,
  initialLikeCount = 0,
  className = "",
}) {
  const { isLoggedIn } = useAuth();
  const { open: openLoginModal } = useLoginModal();

  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [pending, setPending] = useState(false);

  const refreshCount = async () => {
    try {
      const res = await axios({
        method: COMMENTS.LIKE_COUNT(commentId).method,
        url: COMMENTS.LIKE_COUNT(commentId).url,
      });
      setLikeCount(Math.max(0, res.data?.data ?? 0));
    } catch (e) {
      console.error("Failed to fetch comment like count:", e);
    }
  };

  const refreshMyReaction = async () => {
    if (!isLoggedIn) {
      setLiked(false);
      return;
    }
    try {
      const res = await axios({
        method: COMMENTS.MY_REACTION(commentId).method,
        url: COMMENTS.MY_REACTION(commentId).url,
      });
      setLiked(res.data?.data === "LIKE");
    } catch (e) {
      console.error("Failed to fetch my comment reaction:", e);
      setLiked(false);
    }
  };

  useEffect(() => {
    setLikeCount(initialLikeCount);
    setLiked(initialLiked);
    refreshMyReaction();
    refreshCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentId, isLoggedIn]);

  const handleToggleLike = async () => {
    if (pending) return;
    if (!isLoggedIn) return openLoginModal();

    const prevLiked = liked;
    const prevCount = likeCount;
    const nextLiked = !prevLiked;
    const nextCount = Math.max(0, prevCount + (nextLiked ? +1 : -1));

    setLiked(nextLiked);
    setLikeCount(nextCount);
    setPending(true);

    try {
      await axios({
        method: COMMENTS.LIKE(commentId).method,
        url: COMMENTS.LIKE(commentId).url,
      });
    } catch (err) {
      console.error("Failed to toggle like:", err);
      setLiked(prevLiked);
      setLikeCount(prevCount);
    } finally {
      setPending(false);
      refreshMyReaction();
      refreshCount();
    }
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <button
        type="button"
        onClick={handleToggleLike}
        disabled={pending}
        aria-pressed={liked}
        aria-label="Toggle like"
        className={`flex items-center gap-1 px-2 py-1 rounded-full border transition-colors duration-200
          ${liked
            ? "bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/60 dark:text-blue-300 dark:border-blue-800"
            : "text-gray-500 border-gray-300 hover:bg-blue-100 hover:text-blue-600 hover:border-blue-200 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-blue-900/60 dark:hover:text-blue-300 dark:hover:border-blue-800"}
          ${pending ? "opacity-80 cursor-wait" : "cursor-pointer"}`}
      >
        <ThumbsUp size={16} strokeWidth={2.5} />
        <span>{likeCount}</span>
      </button>
    </div>
  );
}
