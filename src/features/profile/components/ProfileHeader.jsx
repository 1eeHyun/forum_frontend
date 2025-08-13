import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, MessageSquare, Share2, Flag } from "lucide-react";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { followUserToggle, checkIsFollowing } from "@profile/services/followApi";
import { fetchMe } from "@auth/services/authApi";
import FollowListModal from "./modal/FollowListModal";
import { fetchProfile } from "@profile/services/profileApi";
import ReportModal from "@report/components/ReportModal";
import { ChatContext } from "@/context/ChatContext";

export default function ProfileHeader({ profile, username, isMine, posts, setProfile }) {
  // Follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Lists modals
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowings, setShowFollowings] = useState(false);

  // Current user (for optimistic list updates)
  const [currentUser, setCurrentUser] = useState(null);

  // Options menu state
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  // Report modal (USER target)
  const [showReportModal, setShowReportModal] = useState(false);

  const navigate = useNavigate();

  // Chat helpers from context (floating chat control)
  const { ensureRoomAndOpenByUsername } = useContext(ChatContext);

  // Fetch current user
  useEffect(() => {
    fetchMe()
      .then((res) => setCurrentUser(res.data?.data ?? null))
      .catch((err) => console.error("fetchMe error", err));
  }, []);

  // Fetch follow status (if viewing someone else)
  useEffect(() => {
    if (!isMine && username) {
      checkIsFollowing(username)
        .then((res) => setIsFollowing(!!res.data?.data))
        .catch((err) => console.error("Follow status error", err));
    }
  }, [username, isMine]);

  // Close options menu on outside click
  useEffect(() => {
    if (!showMenu) return;
    const onDown = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", onDown, true);
    return () => document.removeEventListener("mousedown", onDown, true);
  }, [showMenu]);

  // Follow/unfollow with optimistic list sync
  const handleFollowToggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await followUserToggle(username);
      setIsFollowing((prev) => !prev);

      if (!currentUser) return;

      if (isMine) {
        // If I am viewing my own profile, update my following list optimistically
        setProfile((prev) => ({
          ...prev,
          followings: isFollowing
            ? prev.followings?.filter((f) => f.username !== username)
            : [...(prev.followings || []), { username, nickname: username, imageDto: null }],
        }));
      } else {
        // If I am viewing someone else's profile, update their followers list optimistically
        setProfile((prev) => ({
          ...prev,
          followers: isFollowing
            ? prev.followers?.filter((f) => f.username !== currentUser.username)
            : [...(prev.followers || []), currentUser],
        }));
      }
    } catch (err) {
      console.error("toggle follow failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Open floating chat and focus DM room with this profile user
  const handleMessage = async () => {
    try {
      const presetUser = {
        username,
        nickname: profile?.nickname || username,
        imageDto: profile?.imageDTO || null,
      };
      await ensureRoomAndOpenByUsername(username, presetUser);
      // No navigation: floating chat opens itself and selects the room
    } catch (e) {
      console.error("Open chat failed", e);
    }
  };

  // Share profile link (Web Share API + fallbacks)
  const handleShareProfile = async () => {
    setShowMenu(false);
    const url =
      typeof ROUTES?.PROFILE === "function"
        ? `${window.location.origin}${ROUTES.PROFILE(username)}`
        : `${window.location.origin}/profile/${encodeURIComponent(username)}`;
    const shareData = {
      title: profile.nickname || `@${username}`,
      text: `Check out @${username}'s profile`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        alert("Profile link copied to clipboard.");
      } else {
        // Legacy fallback
        const tmp = document.createElement("input");
        tmp.value = url;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand("copy");
        document.body.removeChild(tmp);
        alert("Profile link copied to clipboard.");
      }
    } catch (e) {
      console.error("share failed", e);
    }
  };

  // Open followers list (refresh first)
  const handleOpenFollowers = async () => {
    try {
      const res = await fetchProfile(username);
      setProfile(res.data?.data);
      setShowFollowers(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Open followings list (refresh first)
  const handleOpenFollowings = async () => {
    try {
      const res = await fetchProfile(username);
      setProfile(res.data?.data);
      setShowFollowings(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-wrap gap-6 md:gap-4 mb-8 items-start">
      {/* Profile image */}
      <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${profile.imageDTO?.imageUrl})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: `${profile.imageDTO?.imagePositionX ?? 50}% ${
              profile.imageDTO?.imagePositionY ?? 50
            }%`,
          }}
        />
      </div>

      {/* Profile info + actions */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-3">
          {/* Handle */}
          <h2 className="text-lg md:text-xl text-gray-700 dark:text-white break-all">@{username}</h2>

          {isMine ? (
            <button
              onClick={() => navigate(ROUTES.PROFILE_EDIT(username))}
              className="px-4 py-1.5 rounded text-sm bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            >
              Edit profile
            </button>
          ) : (
            <>
              {/* Follow / Unfollow */}
              <button
                onClick={handleFollowToggle}
                disabled={loading}
                className={`px-4 py-1.5 text-sm rounded text-white ${
                  isFollowing ? "bg-gray-400 dark:bg-gray-600" : "bg-blue-500 dark:bg-blue-600"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>

              {/* Message (open floating chat and focus/create DM room) */}
              <button
                onClick={handleMessage}
                className="px-4 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                title="Send message"
              >
                <span className="inline-flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message
                </span>
              </button>

              {/* Options (Share / Report) */}
              <div className="relative">
                <button
                  ref={btnRef}
                  onClick={() => setShowMenu((v) => !v)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  aria-haspopup="menu"
                  aria-expanded={showMenu}
                  title="More options"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>

                {showMenu && (
                  <div
                    ref={menuRef}
                    role="menu"
                    className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20 overflow-hidden"
                  >
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"
                      onClick={handleShareProfile}
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                      onClick={() => {
                        setShowMenu(false);
                        // Just open the report modal; ReportModal will resolve userId by username if missing.
                        setShowReportModal(true);
                      }}
                    >
                      <Flag className="w-4 h-4" />
                      Report
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Nickname */}
        <h2 className="text-xl md:text-2xl font-semibold text-black dark:text-white break-words">
          {profile.nickname}
        </h2>

        {/* Counts */}
        <div className="flex mt-2 gap-6 text-sm text-gray-700 dark:text-gray-300 flex-wrap">
          <span>
            <span className="font-semibold text-black dark:text-white">
              {profile.totalPostCount}
            </span>{" "}
            posts
          </span>
          <span className="cursor-pointer hover:underline" onClick={handleOpenFollowers}>
            <span className="font-semibold text-black dark:text-white">
              {profile.followers?.length ?? 0}
            </span>{" "}
            followers
          </span>
          <span className="cursor-pointer hover:underline" onClick={handleOpenFollowings}>
            <span className="font-semibold text-black dark:text-white">
              {profile.followings?.length ?? 0}
            </span>{" "}
            following
          </span>
        </div>

        {/* Follow lists modals */}
        {showFollowers && (
          <FollowListModal
            title="Followers"
            users={profile.followers || []}
            onClose={() => setShowFollowers(false)}
          />
        )}
        {showFollowings && (
          <FollowListModal
            title="Following"
            users={profile.followings || []}
            onClose={() => setShowFollowings(false)}
          />
        )}
      </div>

      {/* User Report Modal (renders via Portal) */}
      <ReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        target={{
          type: "USER",
          id: profile?.id ?? null, // may be null; modal will resolve by username
          name: profile?.nickname || `@${username}`,
          username, // used by modal to set targetUsername and resolve id
        }}
        onSubmitted={() => {
          // optional: refetch or toast
        }}
      />
    </div>
  );
}
