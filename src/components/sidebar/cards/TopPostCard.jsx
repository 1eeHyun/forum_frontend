import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { ROUTES } from "@/constants/apiRoutes/routes";
import { POST_LABELS } from "@/features/post/constants/postLabels";

export default function TopPostCard({ post }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const thumbnail = post.imageUrls?.[0];

  // Community info
  const community = post.community;
  const communityImage = community?.imageDTO?.imageUrl || post.communityProfilePicture?.imageUrl;
  const communityImageX = community?.imageDTO?.imagePositionX ?? 50;
  const communityImageY = community?.imageDTO?.imagePositionY ?? 50;

  // Author info
  const author = post.author;
  const authorImage = author?.profileImage?.imageUrl;
  const authorImageX = author?.profileImage?.imagePositionX ?? 50;
  const authorImageY = author?.profileImage?.imagePositionY ?? 50;

  const openPost = () => {
    navigate(`/post/${post.id}`);
  };

  const openProfile = (e) => {
    e.stopPropagation();
    if (author?.username) {
      navigate(ROUTES.PROFILE(author.username));
    }
  };

  const openCommunity = (e) => {
    e.stopPropagation();
    if (community?.id) {
      navigate(ROUTES.COMMUNITY(community.id));
    } else if (post.communityId) {
      navigate(ROUTES.COMMUNITY(post.communityId));
    }
  };

  const hasCommunity = Boolean(community?.name);

  return (
    <div
      className={`relative rounded-lg p-3 transition cursor-pointer
        ${thumbnail ? "flex flex-row-reverse gap-3 items-center" : "flex-col space-y-2"}
        hover:bg-card-hover hover:scale-[1.01] dark:hover:bg-dark-card-hover
      `}
      onClick={openPost}
    >
      {/* Close button */}
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
            openPost(); // changed: go to post detail
          }}
        />
      )}

      {/* Text content */}
      <div className="flex flex-col justify-between text-sm text-muted w-full">
        <div className="flex items-center gap-2 mb-1">
          {hasCommunity ? (
            <>
              {communityImage && (
                <img
                  src={communityImage}
                  alt="community"
                  onClick={openCommunity}
                  className="w-6 h-6 rounded-full object-cover border border-card hover:ring-2 hover:ring-primary transition cursor-pointer"
                  style={{
                    objectPosition: `${communityImageX}% ${communityImageY}%`,
                  }}
                />
              )}
              <span
                onClick={openCommunity}
                className="text-sm text-primary hover:underline cursor-pointer font-medium transition"
              >
                {community.name}
              </span>
              <span
                onClick={openProfile}
                className="text-xs hover:underline hover:text-primary cursor-pointer transition"
              >
                {POST_LABELS.AUTHOR_PREFIX} {author?.nickname}
              </span>
            </>
          ) : (
            <>
              {authorImage && (
                <img
                  src={authorImage}
                  alt="author"
                  onClick={openProfile}
                  className="w-6 h-6 rounded-full object-cover border border-card hover:ring-2 hover:ring-primary transition cursor-pointer"
                  style={{
                    objectPosition: `${authorImageX}% ${authorImageY}%`,
                  }}
                />
              )}
              <span
                onClick={openProfile}
                className="text-sm hover:underline hover:text-primary cursor-pointer transition"
              >
                {author?.nickname}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <div className="mt-0.5 font-semibold text-black dark:text-white line-clamp-1 text-sm">
          {post.title || POST_LABELS.NO_TITLE}
        </div>

        {/* Content */}
        {post.content && (
          <div className="text-sm text-muted line-clamp-4 mt-1">{post.content}</div>
        )}

        {/* Stats */}
        <div className="text-xs text-muted mt-2 flex gap-4">
          <span>{post.likeCount ?? 0} {POST_LABELS.LIKES}</span>
          <span>{post.commentCount ?? 0} {POST_LABELS.COMMENTS}</span>
        </div>
      </div>
    </div>
  );
}
