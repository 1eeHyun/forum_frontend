import React, { useState, useEffect, useRef } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/apiRoutes/routes";

export default function CommunityHeader({
  community,
  onJoinClick,
  showJoinButton,
  role,  
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  return (
    <>
      {/* Community Banner */}
      <div className="relative h-[180px] md:h-[220px] rounded-t-lg overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${community.bannerImageUrl})` }}
        ></div>
        <div className="absolute inset-0"></div>

        <div className="relative flex items-end pb-4 px-4 md:px-6 h-full z-10">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-full border-4 border-white dark:border-black overflow-hidden">
              <img
                src={community.profileImageDto?.imageUrl || "/assets/default-profile.jpg"}
                alt="profile"
                className="w-full h-full object-cover"
                style={{
                  objectPosition: `${(community.profileImageDto?.imagePositionX ?? 0.5) * 100}% ${(community.profileImageDto?.imagePositionY ?? 0.5) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-0 py-4 flex justify-between items-center flex-wrap gap-4 text-white">
        {/* Community name */}
        <div>
          <h1 className="text-3xl font-bold font-noto text-black dark:text-white">
            {community.name}
          </h1>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {["MANAGER", "MEMBER"].includes(role) && (
            <button
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border border-transparent rounded-full shadow-lg hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-300 ease-in-out"
              onClick={() => navigate("/create-post", { state: { community } })}
            >
              <Plus size={16} />
              Create Post
            </button>
          )}

          {showJoinButton && (
            <button
              onClick={onJoinClick}
              className="px-6 py-2 rounded-full text-sm font-semibold bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-all duration-300 ease-in-out"
            >
              Join
            </button>
          )}

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="w-12 h-12 border-2 border-transparent text-white rounded-full flex items-center justify-center bg-transparent hover:bg-gray-300 hover:text-black transition-all duration-300 ease-in-out dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <MoreHorizontal size={20} className="text-black dark:text-white" />
            </button>

            {showMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-[#1a1c1f] border border-gray-600 rounded-lg shadow-lg z-10 dark:bg-[#121417] dark:border-gray-700">
              {role === "MANAGER" && (
                <button
                onClick={() => {
                  setShowMenu(false);
                  navigate(ROUTES.COMMUNITY_MANAGE(community.id));
                }}
                className="w-full px-3 py-2 text-base text-black dark:text-white flex items-center justify-between transition-all duration-300 rounded-lg 
                bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <Plus size={20} />
                <span className="pl-4">Manage</span>
              </button>              
              )}
            </div>
          )}
          </div>
        </div>
      </div>      
    </>
  );
}
