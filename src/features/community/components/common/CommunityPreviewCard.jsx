import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function CommunityPreviewCard({ community }) {
  const navigate = useNavigate();

  const imageUrl = community.imageDTO?.imageUrl;
  const imagePosX = community.imageDTO?.imagePositionX ?? 50;
  const imagePosY = community.imageDTO?.imagePositionY ?? 50;

  return (
    <div
      onClick={() => navigate(`/communities/${community.id}`)}
      className="flex items-center justify-between gap-3 cursor-pointer p-2 rounded transition
                 hover:bg-gray-200 dark:hover:bg-gray-700
                 shadow-sm"
    >
      {/* Left side: profile image + name */}
      <div className="flex items-center gap-3">
        {imageUrl ? (
          <div className="w-10 h-10 rounded-full overflow-hidden relative flex-shrink-0 bg-gray-200 dark:bg-gray-800">
            <img
              src={imageUrl}
              alt={community.name}
              className="absolute w-full h-full object-cover"
              style={{
                objectPosition: `${imagePosX}% ${imagePosY}%`,
              }}
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600" />
        )}
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {community.name}
        </p>
      </div>

      {/* Right side: arrow icon */}
      <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
    </div>
  );
}
