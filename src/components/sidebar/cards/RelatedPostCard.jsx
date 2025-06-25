import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/apiRoutes/routes";
import { POST_LABELS } from "@/features/post/constants/postLabels";

export default function RelatedPostCard({ post }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const thumbnail = post.imageUrls?.[0];
  const communityImage = post.communityProfilePicture?.imageUrl;

  const openPost = () => {
    navigate(`${ROUTES.HOME}?postId=${post.id}`);
  };

  const openProfile = (e) => {
    e.stopPropagation();
    navigate(ROUTES.PROFILE(post.author?.username));
  };

  const openCommunity = (e) => {
    e.stopPropagation();
    navigate(ROUTES.COMMUNITY(post.communityId));
  };

  return (
    <div
      onClick={openPost}
      className={`
        relative rounded-lg p-3 transition cursor-pointer
        ${thumbnail ? "flex gap-3 items-center" : "flex-col space-y-2"}
        hover:bg-card-hover hover:scale-[1.01]
        dark:hover:bg-dark-card-hover
      `}
    >
      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setVisible(false);
        }}
        className="absolute top-2 right-2 text-muted hover:text-danger"
      >
        <X size={16} />
      </button>

      {/* Thumbnail */}
      {thumbnail && (
        <img
          src={thumbnail}
          alt="thumbnail"
          className="w-32 h-32 rounded-md object-cover flex-shrink-0 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            window.open(thumbnail, "_blank");
          }}
        />
      )}

      {/* Text Section */}
      <div className="flex flex-col justify-between text-sm text-muted w-full">
        <div className="flex items-center gap-2 mb-1" onClick={openCommunity}>
          <img
            src={communityImage}
            alt="community"
            className="w-6 h-6 rounded-full object-cover border border-card"
          />
          <span className="text-sm text-primary hover:underline cursor-pointer font-medium">
            {post.communityName}
          </span>
          <span
            onClick={openProfile}
            className="text-xs text-muted hover:underline hover:text-primary cursor-pointer"
          >
            {POST_LABELS.AUTHOR_PREFIX} {post.author?.nickname}
          </span>
        </div>

        <div className="mt-0.5 font-semibold text-black dark:text-white line-clamp-1 text-sm">
          {post.title}
        </div>

        {post.content && (
          <div className="text-sm text-muted line-clamp-4 mt-1">
            {post.content}
          </div>
        )}

        <div className="text-xs text-muted mt-2 flex gap-4">
          <span>{post.likeCount} {POST_LABELS.LIKES}</span>
          <span>{post.commentCount} {POST_LABELS.COMMENTS}</span>
        </div>
      </div>
    </div>
  );
}
