import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { formatTimeAgo } from "@/utils/dateUtils";
import PostOptionsMenu from "@post/components/menu/PostOptionsMenu";

export default function PostHeader({ post, onDelete, onHide, isHidden }) {
  const formattedTime = formatTimeAgo(post.createdAt);
  if (isHidden) return null;

  const tags = Array.isArray(post.tags) ? post.tags.filter(Boolean) : [];
  const hasTags = tags.length > 0;

  // Fallback-safe tag route
  const tagHref = (t) =>
    typeof ROUTES.TAG === "function"
      ? ROUTES.TAG(t)
      : `/tags/${encodeURIComponent(t)}`;

  const MAX_SHOW = 3;
  const shown = tags.slice(0, MAX_SHOW);
  const more = Math.max(0, tags.length - shown.length);

  return (
    <div className="flex items-center justify-between px-4 py-3">
      {/* Left side: Tags (if exist) else Community */}
      {hasTags ? (
        <div className="flex items-center gap-2 flex-wrap">
          {shown.map((t) => (
            <Link
              key={t}
              to={tagHref(t)}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-full border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              title={`#${t}`}
            >
              <span className="opacity-70">#</span>
              <span className="font-medium">{t}</span>
            </Link>
          ))}
          {more > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">+{more} more</span>
          )}
        </div>
      ) : (
        // Community info (fallback when no tags)
        <>
          {post.community ? (
            <div className="flex items-center gap-2">
              {post.community.imageDTO?.imageUrl && (
                <img
                  src={post.community.imageDTO.imageUrl}
                  alt={post.community.name || "Community Logo"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <Link
                to={ROUTES.COMMUNITY(post.community.id)}
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-gray-700 dark:text-gray-200 font-medium hover:underline"
              >
                {post.community.name}
              </Link>
            </div>
          ) : (
            <div />
          )}
        </>
      )}

      {/* Right side: Author + menu */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
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

        <PostOptionsMenu
          authorUsername={post.author.username}
          postId={post.id}
          onDelete={onDelete}
          onReport={() => console.log("Report")}
          onFollow={() => {}}
          onSave={() => console.log("Save Post")}
          onHide={onHide}
        />
      </div>
    </div>
  );
}
