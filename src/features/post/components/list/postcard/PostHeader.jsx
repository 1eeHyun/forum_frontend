import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { formatTimeAgo } from "@/utils/dateUtils";

export default function PostHeader({ post }) {
  const formattedTime = formatTimeAgo(post.createdAt);

  return (
    <div className="flex items-center justify-between px-4 py-3">
      {/* Community Info */}
      <div className="flex items-center gap-2">
        {post.community?.imageDTO?.imageUrl && (
          <img
            src={post.community.imageDTO.imageUrl}
            alt={post.community.name || "Community Logo"}
            className="w-6 h-6 rounded-full object-cover"
          />
        )}
        <Link
          to={ROUTES.COMMUNITY(post.community.id)}
          onClick={(e) => e.stopPropagation()}
          className="text-sm text-gray-500 font-medium hover:underline" // text-muted => text-gray-500 or text-light-muted
        >
          {post.community.name}
        </Link>
      </div>

      {/* Author Info + Time */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Link
          to={ROUTES.PROFILE(post.author.username)}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 hover:underline"
        >
          <div
            className="w-6 h-6 rounded-full border border-gray-500 bg-cover bg-center"
            style={{
              backgroundImage: `url(${post.author.profileImage?.imageUrl})`,
              backgroundPosition: `${post.author.profileImage?.imagePositionX ?? 50}% ${post.author.profileImage?.imagePositionY ?? 50}%`,
            }}
          />
          <span>{post.author.nickname}</span>
        </Link>
        <span className="text-xs text-gray-400">· {formattedTime}</span>
      </div>
    </div>
  );
}
