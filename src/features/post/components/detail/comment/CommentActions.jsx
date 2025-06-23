import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import axios from "@/api/axios";

export default function CommentActions({ commentId }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleLike = async () => {
    if (liked) {
      // Unlike
      await axios.post(`/comments/${commentId}/unlike`);
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      await axios.post(`/comments/${commentId}/like`);
      setLiked(true);
      if (disliked) setDisliked(false);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleDislike = async () => {
    if (disliked) {
      // Undo dislike
      await axios.post(`/comments/${commentId}/undislike`);
      setDisliked(false);
    } else {
      await axios.post(`/comments/${commentId}/dislike`);
      setDisliked(true);
      if (liked) {
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      }
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        className={`flex items-center gap-1 ${
          liked ? "text-blue-500" : "text-gray-400"
        } hover:text-blue-400 transition`}
        onClick={handleLike}
      >
        <ThumbsUp size={16} strokeWidth={2.5} />
        <span>{likeCount}</span>
      </button>

      <button
        className={`${
          disliked ? "text-red-500" : "text-gray-400"
        } hover:text-red-400 transition`}
        onClick={handleDislike}
      >
        <ThumbsDown size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}
