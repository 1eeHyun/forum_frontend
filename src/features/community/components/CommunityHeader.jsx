import React, { useState, useEffect, useRef } from "react";
import { Plus, MoreHorizontal, LogOut, FilePlus2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { leaveCommunity } from "@community/services/communityApi";

export default function CommunityHeader({
  community,
  onJoinClick,
  showJoinButton, // parent decides
  role,
  onLeaveSuccess, // parent refetch after leaving
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close options menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const isMember = role === "MANAGER" || role === "MEMBER";

  // Navigate to create-post with preselected community
  const handleCreatePost = () => {
    setShowMenu(false);
    navigate("/create-post", { state: { community } });
  };

  // Open leave modal from menu
  const openLeaveModal = () => {
    setShowMenu(false);
    setShowLeaveModal(true);
  };

  // Confirm leave from modal
  const handleConfirmLeave = async () => {
    try {
      await leaveCommunity(community.id);
      setShowLeaveModal(false);
      onLeaveSuccess?.(); // parent will refetch role & posts
    } catch (err) {
      console.error("Failed to leave community:", err);
    }
  };

  return (
    <>
      {/* Banner */}
      <div className="relative h-[180px] md:h-[220px] rounded-t-lg overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${community.bannerImageUrl})` }}
        />
        <div className="absolute inset-0" />

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

      {/* Action bar */}
      <div className="px-0 py-4 flex justify-between items-center flex-wrap gap-4 text-white">
        <h1 className="text-3xl font-bold font-noto text-black dark:text-white">
          {community.name}
        </h1>

        <div className="flex items-center gap-2">
          {/* Top-level Create for members/managers */}
          {isMember && (
            <button
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-300 ease-in-out"
              onClick={handleCreatePost}
            >
              <Plus size={20} />
              Create Post
            </button>
          )}

          {/* Join (shown whenever NOT a member/manager) */}
          {showJoinButton && (
            <button
              onClick={onJoinClick}
              className="px-6 py-2 rounded-full text-sm font-semibold 
                         bg-gray-800 text-white shadow-lg 
                         hover:bg-gray-700 transition-all duration-300 ease-in-out"
            >
              Join
            </button>
          )}

          {/* Options menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="w-12 h-12 border-2 border-transparent rounded-full flex items-center justify-center hover:bg-gray-300 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white"
              aria-haspopup="menu"
              aria-expanded={showMenu}
              aria-label="Open community options"
            >
              <MoreHorizontal size={20} className="text-black dark:text-white" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden">                

                {/* Member/Manager: Create inside menu */}
                {isMember && (
                  <button
                    onClick={handleCreatePost}
                    className="w-full px-3 py-2 text-sm text-black dark:text-white flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
                  >
                    <Plus size={18} />
                    Create Post
                  </button>
                )}

                {/* Member-only: Leave */}
                {role === "MEMBER" && (
                  <button
                    onClick={openLeaveModal}
                    className="w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    <LogOut size={18} />
                    Leave
                  </button>
                )}

                {/* Manager-only: Manage */}
                {role === "MANAGER" && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate(ROUTES.COMMUNITY_MANAGE(community.id));
                    }}
                    className="w-full px-3 py-2 text-sm text-black dark:text-white flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
                  >
                    <Settings size={18} />
                    Manage
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leave Modal — same style as your Join modal */}
      {showLeaveModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={() => setShowLeaveModal(false)} // click outside to close
        >
          <div
            className="bg-white dark:bg-[#1a1d21] p-6 rounded-xl shadow-lg text-black dark:text-white w-[90%] max-w-sm"
            onClick={(e) => e.stopPropagation()} // prevent bubble to backdrop
          >
            <h2 className="text-lg font-bold mb-4">Leave this community?</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              You will no longer be a member and may lose member-only privileges.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 rounded text-sm text-black dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLeave}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-500 rounded text-sm text-white"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
