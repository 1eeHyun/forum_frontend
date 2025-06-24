import { User, MessageSquareText } from "lucide-react";

export default function ProfileInfoCard({ profile }) {
  const {
    username,
    nickname,
    bio,    
    imageDTO,
    imagePositionX = 50,
    imagePositionY = 50,
    totalPostCount = 0,
    followers = [],
    followings = [],
  } = profile;

  const imageUrl = imageDTO?.imageUrl;
  const posX = imageDTO?.imagePositionX ?? imagePositionX;
  const posY = imageDTO?.imagePositionY ?? imagePositionY;

  return (
    <div className="p-4 rounded-xl shadow border space-y-3 bg-white dark:bg-dark-home-sidebar-bg border-gray-300 dark:border-gray-700">
      {/* Profile Image + Name */}
      <div className="flex items-center gap-4">
        {imageUrl ? (
          <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-gray-300 dark:border-gray-600">
            <img
              src={imageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              style={{
                objectPosition: `${posX}% ${posY}%`,
              }}
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
            <User className="text-gray-600" />
          </div>
        )}

        <div className="truncate">
          <h2 className="font-semibold text-lg text-black dark:text-white truncate">
            {nickname}
          </h2>
          <p className="text-sm text-gray-500 truncate">@{username}</p>
        </div>
      </div>

      {/* Bio */}
      {bio && (
        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {bio}
        </p>
      )}

      {/* Divider */}
      <hr className="border-gray-300 dark:border-gray-700" />

      {/* Followers & Following */}
      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <span>{followers.length} followers</span>
        <span className="text-gray-400">·</span>
        <span>{followings.length} following</span>
      </div>

      {/* Post Count */}
      <div className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white">
        <MessageSquareText size={14} className="text-gray-600 dark:text-gray-300" />
        {totalPostCount} posts
      </div>
    </div>
  );
}
