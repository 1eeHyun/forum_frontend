import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import axios from "@/api/axios";
import { COMMENTS } from "@/constants/apiRoutes/comments";

export default function CommentActions({
  commentId,
  initialLiked = false,
  initialDisliked = false,
  initialLikeCount = 0,
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [disliked, setDisliked] = useState(initialDisliked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleLike = async () => {
    try {
      await axios.post(COMMENTS.LIKE(commentId).url);
      const newLiked = !liked;
      setLiked(newLiked);
      if (newLiked) {
        setLikeCount((prev) => prev + 1);
        if (disliked) setDisliked(false);
      } else {
        setLikeCount((prev) => prev - 1);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleDislike = async () => {
    try {
      await axios.post(COMMENTS.DISLIKE(commentId).url);
      const newDisliked = !disliked;
      setDisliked(newDisliked);
      if (newDisliked && liked) {
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      }
    } catch (err) {
      console.error("Failed to toggle dislike:", err);
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        className={`flex items-center gap-1 ${
          liked ? "text-blue-500" : "text-gray-400"
        } hover:text-blue-400 transition`}
        onClick={handleLike}
        aria-label="Toggle like"
      >
        <ThumbsUp size={16} strokeWidth={2.5} />
        <span>{likeCount}</span>    
      </button>
    </div>
  );
}
