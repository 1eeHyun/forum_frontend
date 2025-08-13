// src/features/profile/components/modal/FollowListModal.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { followUserToggle, checkIsFollowing } from "@profile/services/followApi";
import { ROUTES } from "@/constants/apiRoutes/routes";

/**
 * FollowListModal
 * - Light/Dark theme aware
 * - Clicking a user row navigates to the user's profile
 * - For other users: Follow/Following toggle with optimistic UI
 * - For current user: show row but hide the button
 *
 * Props:
 * - title: string
 * - users: Array<{ username: string; nickname?: string; imageDto?: { imageUrl?: string } }>
 * - onClose: () => void
 */
export default function FollowListModal({ title, users, onClose }) {
  const navigate = useNavigate();
  const overlayRef = useRef(null);
  const { username: currentUsername } = useAuth();

  // Per-user follow status and loading flags
  const [followingMap, setFollowingMap] = useState(() => Object.create(null));
  const [loadingMap, setLoadingMap] = useState(() => Object.create(null));

  // Stable list (avoid effect churn)
  const userList = useMemo(() => {
    if (!users) return [];
    const copy = [...users];
    return copy.sort((a, b) => {
      if (a.username === currentUsername) return -1; // a is self → first
      if (b.username === currentUsername) return 1;  // b is self → first
      return 0;
    });
  }, [users, currentUsername]);

  // Initialize follow status (skip self)
  useEffect(() => {
    let active = true;

    const init = async () => {
      const nextMap = Object.create(null);

      await Promise.allSettled(
        userList.map(async (u) => {
          if (u.username === currentUsername) {
            // For self, no follow state needed
            nextMap[u.username] = false;
            return;
          }
          try {
            const res = await checkIsFollowing(u.username);
            nextMap[u.username] = !!res?.data?.data;
          } catch {
            nextMap[u.username] = false;
          }
        })
      );

      if (active) setFollowingMap(nextMap);
    };

    setFollowingMap(Object.create(null));
    setLoadingMap(Object.create(null));

    if (userList.length) init();

    return () => {
      active = false;
    };
  }, [userList, currentUsername]);

  // Resolve profile URL (function-aware)
  const toProfileHref = (uname) => {
    try {
      if (typeof ROUTES?.PROFILE === "function") return ROUTES.PROFILE(uname);
    } catch {}
    return `/profile/${encodeURIComponent(uname)}`;
  };

  // Follow toggle (optimistic)
  const handleToggle = async (e, uname) => {
    e.stopPropagation();

    // Guard: ignore if clicking on self (button shouldn't even render)
    if (uname === currentUsername) return;

    // Prevent double action
    if (loadingMap[uname]) return;

    setLoadingMap((m) => ({ ...m, [uname]: true }));
    setFollowingMap((m) => ({ ...m, [uname]: !m[uname] }));

    try {
      await followUserToggle(uname);
      // keep optimistic state
    } catch {
      // revert on failure
      setFollowingMap((m) => ({ ...m, [uname]: !m[uname] }));
    } finally {
      setLoadingMap((m) => ({ ...m, [uname]: false }));
    }
  };

  // Close on overlay click
  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  return (
    <div
      ref={overlayRef}
      onMouseDown={onOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="
          w-[340px] max-w-[90vw] max-h-[70vh] overflow-y-auto rounded-xl
          bg-white text-black
          dark:bg-[#1a1c1f] dark:text-white
          border border-gray-200 dark:border-gray-700
          shadow-2xl
        "
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white text-xl leading-none"
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* List */}
        <ul className="px-3 py-3 space-y-2">
          {userList.map((u) => {
            const isSelf = u.username === currentUsername;
            const isFollowing = !!followingMap[u.username];
            const isLoading = !!loadingMap[u.username];

            return (
              <li
                key={u.username}
                onClick={() => navigate(toProfileHref(u.username))}
                className="
                  flex items-center justify-between gap-3 rounded-lg px-3 py-2
                  hover:bg-gray-100 dark:hover:bg-[#24272c] cursor-pointer
                "
                title={`Go to @${u.username}'s profile`}
              >
                {/* Left: avatar + names */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={u.imageDto?.imageUrl || "/default-profile.jpg"}
                    alt={`${u.nickname || u.username} profile`}
                    className="w-9 h-9 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/default-profile.jpg";
                    }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">
                      {u.nickname || u.username}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      @{u.username}
                    </span>
                  </div>
                </div>

                {/* Right: follow button (hidden for current user) */}
                {!isSelf && (
                  <button
                    onClick={(e) => handleToggle(e, u.username)}
                    disabled={isLoading}
                    className={`
                      shrink-0 rounded-full px-3 py-2 text-xs font-medium transition
                      border
                      ${isFollowing
                        ? "bg-gray-200 text-gray-800 border-gray-300 dark:bg-[#2c2f35] dark:text-gray-100 dark:border-gray-600"
                        : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"}
                      ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
                    `}
                    aria-pressed={isFollowing}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </li>
            );
          })}

          {userList.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No users to show.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
