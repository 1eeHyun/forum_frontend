import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle, Share } from "lucide-react";

export default function PostActions({ 
    post,
    onLike = () => {},
    onDislike = () => {},
    onCommentClick = () => {},
    iconSize = 18,
    className = ""
  }) {
    const [likeCount, setLikeCount] = useState(post.likeCount || 0);
    const [likedByMe, setLikedByMe] = useState(post.likedByMe || false);
    const [dislikedByMe, setDislikedByMe] = useState(false);
  
    const handleLike = (e) => {
      e.stopPropagation();
      setLikedByMe((prev) => !prev);
      setLikeCount((prev) => (likedByMe ? prev - 1 : prev + 1));
      if (dislikedByMe) setDislikedByMe(false);
      onLike();
    };
  
    const handleDislike = (e) => {
      e.stopPropagation();
      setDislikedByMe((prev) => !prev);
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
        <div className={`flex items-center gap-3 border-card-t pt-4 px-4 pb-4 text-sm text-muted ${className}`}>
        <div className="flex items-center gap-2 bg-action rounded-full px-4 py-1.5 hover:bg-action-hover transition">
          <button onClick={handleLike} className="flex items-center gap-1">
            <ThumbsUp size={iconSize} className={likedByMe ? "text-primary" : "text-muted"} />
            <span className="font-medium">{likeCount}</span>
          </button>
      
          <div className="w-px h-5 bg-gray-400 dark:bg-gray-600" />
      
          <button onClick={handleDislike}>
            <ThumbsDown size={iconSize} className={dislikedByMe ? "text-danger" : "text-muted"} />
          </button>
        </div>
      
        <button
          onClick={onCommentClick}
          className="flex items-center gap-2 bg-action rounded-full px-4 py-1.5 hover:bg-action-hover transition"
        >
          <MessageCircle size={iconSize - 2} />
          <span>{post.commentCount || 0}</span>
        </button>
      
        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-action rounded-full px-4 py-1.5 hover:bg-action-hover transition"
        >
          <Share size={iconSize} />
          <span className="font-medium">Share</span>
        </button>
      </div>      
    );
  }  
