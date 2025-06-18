import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/apiRoutes/routes";

export default function CommunityUserCard({ user, showRole = false, showStatusDot = true }) {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user.username) {
      navigate(ROUTES.PROFILE.replace(":username", user.username));
    }
  };

  const imageUrl = user.profileImage?.imageUrl;
  const imagePosX = user.profileImage?.imagePositionX ?? 50;
  const imagePosY = user.profileImage?.imagePositionY ?? 50;

  return (
    <div className="flex items-center gap-2 text-sm py-1 dark:text-gray-200">
      {showStatusDot && (
        <span className="w-2 h-2 bg-green-500 rounded-full inline-block ml-2" /> 
      )}

      {/* Profile image with hover effect and left margin */}
      <img
        src={imageUrl}
        alt={user.nickname || "User"}
        className="ml-2 w-10 h-10 rounded-full object-cover cursor-pointer transition-transform hover:scale-105 hover:ring-2 hover:ring-blue-500 dark:ring-blue-300"
        onClick={handleProfileClick}
        style={{
          objectPosition: `${imagePosX}% ${imagePosY}%`,  // This should work correctly now
        }}
      />

      {/* Nickname + Username + Role */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span
            className="cursor-pointer text-gray-800 dark:text-white hover:underline hover:text-blue-400 dark:hover:text-blue-300 transition"
            onClick={handleProfileClick}
          >
            {user.nickname}
          </span>
        </div>
        {/* Display @username */}
        <span className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</span>

        {showRole && user.role && (
          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {user.role.toLowerCase()}
          </span>
        )}
      </div>
    </div>
  );
}
