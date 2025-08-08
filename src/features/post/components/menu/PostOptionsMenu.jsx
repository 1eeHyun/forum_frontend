import {
  MoreHorizontal,
  UserPlus,
  UserMinus,
  Bookmark,
  BookmarkMinus,
  EyeOff,
  Flag,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/apiRoutes/routes";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { checkIsFollowing, followUserToggle } from "@profile/services/followApi";
import { checkIsBookmarked, toggleBookmark } from "@bookmark/services/bookmarkApi";

/**
 * PostOptionsMenu
 * - Context menu for post actions
 * - Fixes navigation on delete by stopping event propagation in all menu interactions
 * - Closes on outside click
 * - Shows confirm modal before delete
 */
export default function PostOptionsMenu({
  authorUsername,
  postId,
  onEdit,
  onDelete,
  onReport,
  onHide,
}) {
  // Menu open/close
  const [open, setOpen] = useState(false);

  // Delete confirm modal open/close
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(true);

  // Bookmark state
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(true);

  // Refs & router
  const menuRef = useRef(null);
  const { username: loggedInUsername, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Owner check
  const isOwner =
    isLoggedIn &&
    loggedInUsername?.toLowerCase() === authorUsername?.toLowerCase();

  // Fetch follow status (only when needed)
  useEffect(() => {
    let ignore = false;

    async function fetchFollowStatus() {
      if (!isLoggedIn || isOwner || !authorUsername) {
        setFollowLoading(false);
        return;
      }
      try {
        const res = await checkIsFollowing(authorUsername);
        if (!ignore) setIsFollowing(!!res.data?.data);
      } catch (err) {
        console.error("Failed to check follow status:", err);
      } finally {
        if (!ignore) setFollowLoading(false);
      }
    }

    setFollowLoading(true);
    fetchFollowStatus();

    return () => {
      ignore = true;
    };
  }, [authorUsername, isLoggedIn, isOwner]);

  // Fetch bookmark status (only when needed)
  useEffect(() => {
    let ignore = false;

    async function fetchBookmarkStatus() {
      if (!isLoggedIn || isOwner || !postId) {
        setBookmarkLoading(false);
        return;
      }
      try {
        const res = await checkIsBookmarked(postId);
        if (!ignore) setIsBookmarked(!!res.data?.data);
      } catch (err) {
        console.error("Failed to check bookmark status:", err);
      } finally {
        if (!ignore) setBookmarkLoading(false);
      }
    }

    setBookmarkLoading(true);
    fetchBookmarkStatus();

    return () => {
      ignore = true;
    };
  }, [postId, isLoggedIn, isOwner]);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      // If click is outside the menu, close it
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside, true);
      return () => document.removeEventListener("mousedown", handleClickOutside, true);
    }
  }, [open]);

  // Guard: hide menu for guests (optional; remove if you want menu for guests too)
  if (!isLoggedIn) return null;

  // Common menu item styles
  const menuItemStyle =
    "flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700";

  // Utility: stop propagation
  const stop = (e) => e.stopPropagation();

  // Follow toggle
  const handleFollowToggle = async (e) => {
    e?.stopPropagation?.();
    try {
      await followUserToggle(authorUsername);
      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    }
  };

  // Bookmark toggle
  const handleBookmarkToggle = async (e) => {
    e?.stopPropagation?.();
    try {
      await toggleBookmark(postId);
      setIsBookmarked((prev) => !prev);
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  return (
    <div
      className="relative"
      ref={menuRef}
      onClick={stop} // Prevent bubbling to parent cards
      data-post-options-open={open ? "true" : "false"} // Helpful for parent guards if needed
    >
      {/* Kebab button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="ml-2 p-2 rounded-full text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open post options"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {/* Menu popover */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-600 rounded-md z-20 py-1"
          role="menu"
          onClick={stop} // Prevent bubbling from items
        >
          {isOwner ? (
            <>
              {/* Edit */}
              <button
                className={menuItemStyle}
                type="button"
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  if (postId) {
                    navigate(ROUTES.POST_EDIT(postId));
                  } else {
                    onEdit?.();
                  }
                }}
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>

              {/* Delete (opens confirm) */}
              <button
                className={`${menuItemStyle} text-red-500`}
                type="button"
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  setIsConfirmOpen(true);
                }}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          ) : (
            <>
              {/* Follow / Unfollow */}
              {!followLoading && (
                <button
                  className={menuItemStyle}
                  type="button"
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    handleFollowToggle(e);
                  }}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="w-4 h-4" />
                      Unfollow Author
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Follow Author
                    </>
                  )}
                </button>
              )}

              {/* Save / Unsave */}
              {!bookmarkLoading && (
                <button
                  className={menuItemStyle}
                  type="button"
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    handleBookmarkToggle(e);
                  }}
                >
                  {isBookmarked ? (
                    <>
                      <BookmarkMinus className="w-4 h-4 text-yellow-500" />
                      Unsave
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
              )}

              {/* Hide */}
              <button
                className={menuItemStyle}
                type="button"
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  onHide?.();
                }}
              >
                <EyeOff className="w-4 h-4" />
                Hide
              </button>

              {/* Report */}
              <button
                className={`${menuItemStyle} text-red-500`}
                type="button"
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  onReport?.();
                }}
              >
                <Flag className="w-4 h-4" />
                Report
              </button>
            </>
          )}
        </div>
      )}

      {/* Confirm delete modal */}
      <ConfirmModal
        open={isConfirmOpen}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        onCancel={(e) => {
          e?.stopPropagation?.();
          setIsConfirmOpen(false);
        }}
        onConfirm={(e) => {
          e?.stopPropagation?.();
          setIsConfirmOpen(false);
          onDelete?.(e);
        }}
      />
    </div>
  );
}
