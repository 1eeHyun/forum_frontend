import { formatTimeAgo } from "@/utils/dateUtils";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants/apiRoutes/routes";

const iconSize = "w-5 h-5";
const avatarSize = "w-5 h-5";
const communityAvatarSize = "w-7 h-7";

export default function PostHeader({ title, author, createdAt, community }) {
  const navigate = useNavigate();

  const handleCommunityClick = () => {
    if (community?.id) navigate(ROUTES.COMMUNITY(community.id));
  };

  const handleAuthorClick = () => {
    if (author?.username) navigate(ROUTES.PROFILE(author.username));
  };

  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
      {/* Community + Author */}
      <div className="flex items-center justify-between mb-2 text-sm text-gray-500 dark:text-gray-400">
        {/* Left: Community Info */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-black dark:hover:text-white"
            aria-label="Go back"
          >
            <ArrowLeft className={iconSize} />
          </button>

          {community?.imageDTO?.imageUrl && (
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
            {community?.name ?? "Unknown Community"}
          </span>
        </div>

        {/* Right: Author */}
        <div className="flex items-center gap-1">
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
          <span className="text-gray-400 text-sm">· {formatTimeAgo(createdAt)}</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-black dark:text-white">{title}</h1>
    </div>
  );
}
