import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, MessageCircle, Share } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import useLoginModal from "@/hooks/auth/useLoginModal";

export default function PostActions({ 
  post,
  onLike = () => {},
  onDislike = () => {},
  onCommentClick = () => {},
  iconSize = 18,
  className = ""
}) {
  const { isLoggedIn } = useAuth();
  const { open: openLoginModal } = useLoginModal();

  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [likedByMe, setLikedByMe] = useState(post.likedByMe || false);
  const [dislikedByMe, setDislikedByMe] = useState(false);

  useEffect(() => {
    setLikedByMe(post.likedByMe || false);
    setDislikedByMe(false); // TODO: if you later support it, change here
  }, [post.id]);

  const handleLike = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) return openLoginModal();

    const nextLiked = !likedByMe;
    setLikedByMe(nextLiked);
    setLikeCount((prev) => prev + (nextLiked ? 1 : -1));
    if (dislikedByMe) setDislikedByMe(false);
    onLike();
  };

  const handleDislike = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) return openLoginModal();

    const nextDisliked = !dislikedByMe;
    setDislikedByMe(nextDisliked);
    if (likedByMe) {
      setLikedByMe(false);
      setLikeCount((prev) => prev - 1);
    }
    onDislike();
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("postId", post.id);
      await navigator.clipboard.writeText(url.toString());
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className={`ml-4 flex gap-3 mt-2 my-2 text-sm font-medium text-gray-700 dark:text-gray-300 ${className}`}>
      {/* Upvote / Downvote box */}
      <div className="flex items-center bg-gray-50 dark:bg-[#1f1f1f] rounded-full overflow-hidden shadow border border-gray-300 dark:border-gray-700">
        <button
          onClick={handleLike}
          className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          title="Upvote"
        >
          <ArrowUp
            className={`w-4 h-4 ${likedByMe ? "text-orange-500" : "text-gray-500"} transition`}
          />
        </button>
        <span className="px-2 text-base">{likeCount}</span>
        <button
          onClick={handleDislike}
          className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          title="Downvote"
        >
          <ArrowDown
            className={`w-4 h-4 ${dislikedByMe ? "text-blue-500" : "text-gray-500"} transition`}
          />
        </button>
      </div>

      {/* Comment button */}
      <button
        onClick={onCommentClick}
        className="group flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-[#1f1f1f] rounded-full shadow border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <MessageCircle size={iconSize - 2} className="text-gray-500 group-hover:text-indigo-500" />
        <span>{post.commentCount || 0}</span>
      </button>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="group flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-[#1f1f1f] rounded-full shadow border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <Share size={iconSize} className="text-gray-500 group-hover:text-teal-500" />
        <span>Share</span>
      </button>
    </div>
  );
}
