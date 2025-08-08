import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { togglePostHide } from "@post/services/postApi";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { deletePost } from "@post/services/postApi"; 

import PostHeader from "./PostHeader";
import PostMediaSlider from "./PostMediaSlider";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import PostHiddenCard from "./PostHiddenCard";

export default function PostCard({ post, onDeleted }) {
  const navigate = useNavigate();
  const hasFiles = post.fileUrls && post.fileUrls.length > 0;

  const [isHidden, setIsHidden] = useState(() => post.isHidden);
  const [showSnackbar, setShowSnackbar] = useState(() => post.isHidden);

  useEffect(() => {
    if (post.isHidden) {
      setShowSnackbar(true);
    }
  }, [post.isHidden]);

  const handleToggleHide = async () => {
    try {
      await togglePostHide(post.id);
      setIsHidden(true);
      setShowSnackbar(true);
    } catch (e) {
      console.error("Hide failed", e);
    }
  };

  const handleUndoHide = async () => {
    try {
      await togglePostHide(post.id);
      setIsHidden(false);
      setShowSnackbar(false);
    } catch (e) {
      console.error("Undo failed", e);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      
      if (onDeleted) {
        onDeleted(post.id);
      } else {
        
        navigate(ROUTES.HOME);
      }
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const handleCardClick = () => {
    if (!isHidden) {
      navigate(ROUTES.POST_DETAIL(post.id));
    }
  };

  return (
    <div className="mb-4 w-full">
      <div
        onClick={handleCardClick}
        className={`rounded-xl border border-card transition duration-200 overflow-hidden 
          ${isHidden
            ? "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-default"
            : "cursor-pointer hover:border-card-hover hover:bg-card-bg hover:scale-[1.01] bg-white dark:bg-[#1a1d21]"
          }`}
      >
        {isHidden ? (
          <PostHiddenCard onUndo={handleUndoHide} />
        ) : (
          <>
            <PostHeader
              post={post}
              onDelete={handleDelete}
              onHide={handleToggleHide}
              isHidden={isHidden}
            />            

            <div className="px-4 mt-2">
              <h3 className="text-lg font-semibold text-black dark:text-white line-clamp-2 break-words">
                {post.title}
              </h3>
            </div>
            {hasFiles ? (
              <PostMediaSlider files={post.fileUrls} />
            ) : (
              <PostContent content={post.content} />
            )}
            <PostActions post={post} />
          </>
        )}
      </div>
    </div>
  );
}
