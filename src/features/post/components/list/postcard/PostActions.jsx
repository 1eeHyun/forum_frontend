import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle, Share } from "lucide-react";

export default function PostActions({ post }) {
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [likedByMe, setLikedByMe] = useState(post.likedByMe || false);
  const [dislikedByMe, setDislikedByMe] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    setLikedByMe((prev) => !prev);
    setLikeCount((prev) => (likedByMe ? prev - 1 : prev + 1));
    if (dislikedByMe) setDislikedByMe(false);
  };

  const handleDislike = (e) => {
    e.stopPropagation();
    setDislikedByMe((prev) => !prev);
    if (likedByMe) {
      setLikedByMe(false);
      setLikeCount((prev) => prev - 1);
    }
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    // TODO: implement comment navigation
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      const shareUrl = `${window.location.origin}/?postId=${post.id}`;
      await navigator.clipboard.writeText(shareUrl);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="flex items-center gap-3 border-t border-gray-700 pt-4 px-4 text-sm text-white pb-4">
      <div className="flex items-center gap-2 bg-[#2a2c2f] rounded-full px-4 py-1.5 hover:bg-[#3a3c3f] transition">
        <button
          onClick={handleLike}
          className="flex items-center gap-1"
        >
          <ThumbsUp
            size={18}
            className={likedByMe ? "text-blue-400" : "text-gray-300"}
            strokeWidth={2}
          />
          <span className="font-medium">{likeCount}</span>
        </button>

        <div className="w-px h-5 bg-gray-600" />

        <button onClick={handleDislike} className="text-gray-300">
          <ThumbsDown
            size={18}
            className={dislikedByMe ? "text-red-400" : "text-gray-300"}
            strokeWidth={2}
          />
        </button>
      </div>

      <button
        onClick={handleCommentClick}
        className="flex items-center gap-2 bg-[#2a2c2f] rounded-full px-4 py-1.5 hover:bg-[#3a3c3f] transition"
      >
        <MessageCircle size={16} strokeWidth={2} />
        <span>{post.commentCount || 0}</span>
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 bg-[#2a2c2f] rounded-full px-4 py-1.5 hover:bg-[#3a3c3f] transition"
      >
        <Share size={18} />
        <span className="font-medium">Share</span>
      </button>
    </div>
  );
}
