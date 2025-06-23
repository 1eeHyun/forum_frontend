import { formatTimeAgo } from "@/utils/dateUtils";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants/apiRoutes/routes";

export default function PostHeader({ title, author, createdAt, community }) {
  const navigate = useNavigate();

  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">      

      {/* Community - Left / Author - Right */}
      <div className="flex items-center justify-between mb-2 text-sm text-gray-500 dark:text-gray-400">
        {/* Left: Community Info */}
        <div className="flex items-center gap-2">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-black dark:hover:text-white"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Community image */}
          {community?.imageDTO?.imageUrl && (
            <img
              src={community.imageDTO.imageUrl}
              alt={community.name}
              className="w-7 h-7 rounded-full object-cover"
            />
          )}
          <span
            className="text-blue-600 font-semibold hover:underline cursor-pointer"
            onClick={() => navigate(ROUTES.COMMUNITY(community.id))}
          >
            {community?.name}
          </span>
        </div>

        {/* Right: Author + Time */}
        <div className="flex items-center gap-1">
          <img
            src={author.profileImage?.imageUrl}
            alt="author"
            className="w-5 h-5 rounded-full object-cover"
          />
          <span
            className="text-sm text-gray-700 dark:text-gray-300 font-medium hover:underline cursor-pointer"
            onClick={() => navigate(ROUTES.PROFILE(author.username))}
          >
            {author.nickname}
          </span>
          <span className="text-gray-400 text-sm">· {formatTimeAgo(createdAt)}</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-black dark:text-white">{title}</h1>
    </div>
  );
}
