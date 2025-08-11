import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  MoreHorizontal,
  LogOut,
  Settings,
  Share2,
  Flag,
  Ban,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/apiRoutes/routes";
import {
  leaveCommunity,
  toggleFavoriteCommunity,
} from "@community/services/communityApi";
import ReportModal from "@report/components/ReportModal";

export default function CommunityHeader({
  community,
  onJoinClick,
  showJoinButton,     // Parent decides (true when NOT a member/manager)
  role,
  onLeaveSuccess,     // Parent refetch after leaving
  onReportClick,      // Optional: parent opens report modal
  onBlockToggle,      // Optional: parent toggles block
  onRefreshCommunity, // Parent fetchCommunityDetail to sync server state
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [favorite, setFavorite] = useState(!!community?.favorite);
  const [showReportModal, setShowReportModal] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  const isMember = role === "MANAGER" || role === "MEMBER";

  // Keep local favorite in sync with parent community prop (e.g., after refresh)
  useEffect(() => {
    setFavorite(!!community?.favorite);
  }, [community?.favorite]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  // Navigate to create-post with preselected community
  const handleCreatePost = () => {
    setShowMenu(false);
    navigate("/create-post", { state: { community } });
  };

  // Favorite toggle: optimistic update + rollback on failure + refresh from server
  const handleFavoriteToggle = async () => {
    try {
      setShowMenu(false);
      setFavorite((prev) => !prev);               // optimistic
      await toggleFavoriteCommunity(community.id);
      await onRefreshCommunity?.();               // sync from server (ensures refresh correctness)
    } catch (e) {
      console.error("Failed to toggle favorite", e);
      setFavorite((prev) => !prev);               // rollback
    }
  };

  // Share link (Web Share API fallback to clipboard)
  const handleShare = async () => {
    setShowMenu(false);
    const shareUrl = `${window.location.origin}/communities/${community.id}`;
    const shareData = {
      title: community.name,
      text: `Check out ${community.name}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard.");
      } else {
        const tmp = document.createElement("input");
        tmp.value = shareUrl;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand("copy");
        document.body.removeChild(tmp);
        alert("Link copied to clipboard.");
      }
    } catch (e) {
      console.error("Share failed", e);
    }
  };

  // Report
  const handleReport = () => {
    setShowMenu(false);
    if (onReportClick) {
      onReportClick(community);
    } else {
      setShowReportModal(true);
    }
  };

  const handleBlockToggle = () => {
    setShowMenu(false);
    onBlockToggle?.(community);
  };

  // Open leave modal
  const openLeaveModal = () => {
    setShowMenu(false);
    setShowLeaveModal(true);
  };

  // Confirm leave
  const handleConfirmLeave = async () => {
    try {
      await leaveCommunity(community.id);
      setShowLeaveModal(false);
      onLeaveSuccess?.(); // parent refetches role & posts
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
      <div className="px-0 py-4 flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold font-noto text-black dark:text-white">
          {community.name}
        </h1>

        <div className="flex items-center gap-2">
          {/* Top-level "Create Post" for members/managers */}
          {isMember && (
            <button
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-300 ease-in-out"
              onClick={handleCreatePost}
            >
              <Plus size={20} />
              Create Post
            </button>
          )}

          {/* Join for non-members */}
          {showJoinButton && (
            <button
              onClick={onJoinClick}
              className="px-6 py-2 rounded-full text-sm font-semibold bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-all duration-300 ease-in-out"
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
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden">
                {/* Create (member/manager) */}
                {isMember && (
                  <button
                    onClick={handleCreatePost}
                    className="w-full px-3 py-2 text-sm text-black dark:text-white flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
                  >
                    <Plus size={18} />
                    Create Post
                  </button>
                )}

                {/* Favorite (member/manager) */}
                {isMember && (
                  <button
                    onClick={handleFavoriteToggle}
                    className="w-full px-3 py-2 text-sm text-black dark:text-white flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
                  >
                    <Star
                      size={18}
                      className={
                        favorite
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-500 dark:text-gray-300"
                      }
                    />
                    {favorite ? "Unfavorite" : "Favorite"}
                  </button>
                )}

                {/* Share (everyone) */}
                <button
                  onClick={handleShare}
                  className="w-full px-3 py-2 text-sm text-black dark:text-white flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
                >
                  <Share2 size={18} />
                  Share
                </button>

                {/* Report (member/guest) */}
                {role !== "MANAGER" && (
                  <button
                    onClick={handleReport}
                    className="w-full px-3 py-2 text-sm text-black dark:text-white flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
                  >
                    <Flag size={18} />
                    Report
                  </button>
                )}

                {/* Block guest */}
                {role !== "MEMBER" && role !== "MANAGER" && (
                  <button
                    onClick={handleBlockToggle}
                    className="w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/30 border-b border-gray-200 dark:border-gray-700"
                  >
                    <Ban size={18} />
                    Block
                  </button>
                )}

                {/* Leave (member only) */}
                {role === "MEMBER" && (
                  <button
                    onClick={openLeaveModal}
                    className="w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    <LogOut size={18} />
                    Leave
                  </button>
                )}

                {/* Manage (manager only) */}
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

      {/* Leave modal */}
      {showLeaveModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={() => setShowLeaveModal(false)}
        >
          <div
            className="bg-white dark:bg-[#1a1d21] p-6 rounded-xl shadow-lg text-black dark:text-white w-[90%] max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-2">Leave this community?</h2>
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

      {/* Report Modal (fallback) — Leave 모달과는 독립 렌더링 */}
      <ReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        target={{ type: "COMMUNITY", id: community.id, name: community.name }}
        onSubmitted={onRefreshCommunity}
      />
    </>
  );
}
