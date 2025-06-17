import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function TopPostCard({ post, fromCommunity = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const thumbnail = post.imageUrls?.[0];
  const communityImage = post.communityProfilePicture?.imageUrl;
  const authorImage = post.author?.profileImage?.imageUrl;

  const openPost = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("postId", post.id);
    navigate({ pathname: location.pathname, search: searchParams.toString() });
  };

  const openProfile = (e) => {
    e.stopPropagation();
    navigate(`/profile/${post.author?.username}`);
  };

  const openCommunity = (e) => {
    e.stopPropagation();
    navigate(`/communities/${post.communityId}`);
  };

  return (
    <div
      className={`relative rounded-lg p-3 transition cursor-pointer
        ${thumbnail ? "flex flex-row-reverse gap-3 items-center" : "flex-col space-y-2"}
         hover:bg-card-hover hover:scale-[1.01]
         dark:hover:bg-dark-card-hover
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
          className="w-32 h-32 rounded-md object-cover flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            window.open(thumbnail, "_blank");
          }}
        />
      )}

      {/* Text content */}
      <div className="flex flex-col justify-between text-sm text-muted w-full">
        <div className="flex items-center gap-2 mb-1">
          {fromCommunity ? (
            <>
              <img
                src={authorImage || "/default-profile.jpg"}
                alt="author"
                onClick={openProfile}
                className="w-6 h-6 rounded-full object-cover border border-card hover:ring-2 hover:ring-primary transition cursor-pointer"
              />
              <span
                onClick={openProfile}
                className="text-sm hover:underline hover:text-primary cursor-pointer transition"
              >
                {post.author?.nickname}
              </span>
            </>
          ) : (
            <>
              <img
                src={communityImage || "/assets/default-community.jpg"}
                alt="community"
                onClick={openCommunity}
                className="w-6 h-6 rounded-full object-cover border border-card hover:ring-2 hover:ring-primary transition cursor-pointer"
              />
              <span
                onClick={openCommunity}
                className="text-sm text-primary hover:underline cursor-pointer font-medium transition"
              >
                {post.communityName}
              </span>
              <span
                onClick={openProfile}
                className="text-xs hover:underline hover:text-primary cursor-pointer transition"
              >
                • {post.author?.nickname}
              </span>
            </>
          )}
        </div>

        <div className="mt-0.5 font-semibold text-black dark:text-white line-clamp-1 text-sm">
          {post.title || "(No title)"}
        </div>

        {post.content && (
          <div className="text-sm text-muted line-clamp-4 mt-1">
            {post.content}
          </div>
        )}

        <div className="text-xs text-muted mt-2 flex gap-4">
          <span>{post.likeCount ?? 0} likes</span>
          <span>{post.commentCount ?? 0} comments</span>
        </div>
      </div>
    </div>
  );
}
