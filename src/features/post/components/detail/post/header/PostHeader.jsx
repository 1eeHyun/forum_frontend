import { formatTimeAgo } from "@/utils/dateUtils";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants/apiRoutes/routes";
import PostOptionsMenu from "@post/components/menu/PostOptionsMenu";

const iconSize = "w-5 h-5";
const avatarSize = "w-5 h-5";
const communityAvatarSize = "w-7 h-7";

export default function PostHeader({
  title,
  author,
  createdAt,
  community,
  postId,
  onDelete,
  onHide,
  tags = [],               // ✅ 추가: 태그 배열 (선택)
}) {
  const navigate = useNavigate();
  const formattedTime = formatTimeAgo(createdAt);
  const hasTags = Array.isArray(tags) && tags.length > 0;

  const handleCommunityClick = () => {
    if (community?.id) navigate(ROUTES.COMMUNITY(community.id));
  };

  const handleAuthorClick = () => {
    if (author?.username) navigate(ROUTES.PROFILE(author.username));
  };

  const goTag = (t) => {
    const path = typeof ROUTES.TAG === "function" ? ROUTES.TAG(t) : `/tags/${encodeURIComponent(t)}`;
    navigate(path);
  };

  const MAX_SHOW = 3;
  const shown = hasTags ? tags.slice(0, MAX_SHOW) : [];
  const more = hasTags ? Math.max(0, tags.length - shown.length) : 0;

  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 relative">
      {/* Top Section: Tags or Community + Author/Time/Menu */}
      <div className="flex items-center justify-between mb-2 text-sm text-gray-500 dark:text-gray-400">
        {/* Left: Back + Tags (if any) else Community */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-black dark:hover:text-white"
            aria-label="Go back"
          >
            <ArrowLeft className={iconSize} />
          </button>

          {hasTags ? (
            <div className="flex items-center gap-2 flex-wrap">
              {shown.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => goTag(t)}
                  className="inline-flex items-center gap-1 rounded-full border border-gray-300 dark:border-gray-600 px-2 py-0.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  title={`#${t}`}
                >
                  <span className="opacity-70">#</span>
                  <span className="font-medium">{t}</span>
                </button>
              ))}
              {more > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">+{more} more</span>
              )}
            </div>
          ) : (
            community?.id ? (
              <>
                {community.imageDTO?.imageUrl && (
                  <img
                    src={community.imageDTO.imageUrl}
                    alt={community.name}
                    className={`${communityAvatarSize} rounded-full object-cover`}
                  />
                )}
                <span
                  className="text-blue-500 font-semibold hover:underline cursor-pointer"
                  onClick={handleCommunityClick}
                >
                  {community.name}
                </span>
              </>
            ) : (
              <div />
            )
          )}
        </div>

        {/* Right: Author info, timestamp, and options menu */}
        <div className="flex items-center gap-1 relative">
          {author?.profileImage?.imageUrl && (
            <img
              src={author.profileImage.imageUrl}
              alt="author"
              className={`${avatarSize} rounded-full object-cover`}
            />
          )}
          <span
            className="text-sm text-gray-700 dark:text-gray-300 font-medium hover:underline cursor-pointer"
            onClick={handleAuthorClick}
          >
            {author?.nickname ?? "Unknown Author"}
          </span>
          <span className="text-gray-400 text-sm">· {formattedTime}</span>

          <PostOptionsMenu
            authorUsername={author?.username}
            postId={postId}
            onDelete={onDelete}
            onReport={() => console.log("Report")}
            onFollow={(willFollow) => {
              // ✅ bug fix: use author.username (not undefined post)
              if (author?.username) {
                if (willFollow) {
                  // followAuthor(author.username);
                } else {
                  // unfollowAuthor(author.username);
                }
              }
            }}
            onSave={() => console.log("Save Post")}
            onHide={onHide}
          />
        </div>
      </div>

      {/* Post Title */}
      <h1 className="text-2xl font-bold text-black dark:text-white">{title}</h1>
    </div>
  );
}
