import {
  MoreHorizontal, UserPlus, UserMinus, Bookmark, BookmarkMinus,
  EyeOff, Flag, Pencil, Trash2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/apiRoutes/routes";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { checkIsFollowing, followUserToggle } from "@profile/services/followApi";
import { checkIsBookmarked, toggleBookmark } from "@bookmark/services/bookmarkApi";
import ReportModal from "@report/components/ReportModal";

export default function PostOptionsMenu({
  authorUsername,
  postId,
  onEdit,
  onDelete,
  onReport,   // optional: parent opens its own report modal
  onHide,
}) {
  const [open, setOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(true);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);            // ⬅ 버튼 참조
  const { username: loggedInUsername, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const isOwner =
    isLoggedIn &&
    loggedInUsername?.toLowerCase() === authorUsername?.toLowerCase();

  // 메뉴 위치(state)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 192 }); // w-48 = 12rem = 192px

  // 버튼 클릭 시 위치 계산
  const recalcPosition = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const top = r.bottom + 8; // 버튼 아래 8px
    // 기본은 오른쪽 정렬
    let left = r.right - pos.width;
    // 화면 밖으로 나가면 왼쪽 정렬
    if (left < 8) left = Math.max(8, r.left);
    setPos({ ...pos, top, left });
  };

  useEffect(() => {
    if (!open) return;
    recalcPosition();
    const onScrollOrResize = () => recalcPosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Follow status
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
    return () => { ignore = true; };
  }, [authorUsername, isLoggedIn, isOwner]);

  // Bookmark status
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
    return () => { ignore = true; };
  }, [postId, isLoggedIn, isOwner]);

  // 바깥 클릭 닫기 (포털에서도 동작)
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          buttonRef.current && !buttonRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown, true);
    return () => document.removeEventListener("mousedown", onDown, true);
  }, [open]);

  if (!isLoggedIn) return null;

  const menuItemStyle =
    "flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700";

  const handleFollowToggle = async (e) => {
    e?.stopPropagation?.();
    try {
      await followUserToggle(authorUsername);
      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    }
  };

  const handleBookmarkToggle = async (e) => {
    e?.stopPropagation?.();
    try {
      await toggleBookmark(postId);
      setIsBookmarked((prev) => !prev);
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  // Report: parent handler가 true를 반환하면 부모가 처리, 아니면 로컬 모달
  const handleReport = (e) => {
    e?.stopPropagation?.();
    setOpen(false);
    let handled = false;
    if (typeof onReport === "function") {
      try {
        handled = onReport({ type: "POST", id: postId, username: authorUsername }) === true;
      } catch (_) { handled = false; }
    }
    if (!handled) setShowReportModal(true);
  };

  return (
    <div className="relative" data-post-options-open={open ? "true" : "false"}>
      {/* Kebab button */}
      <button
        ref={buttonRef}                           // ⬅ 버튼 ref
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

      {/* Menu popover in Portal */}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="z-[1000] py-1 w-48 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-600 rounded-md fixed" // ⬅ fixed + 높은 z-index
            style={{ top: pos.top, left: pos.left }}
            onClick={(e) => e.stopPropagation()}
          >
            {isOwner ? (
              <>
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

                <button
                  className={`${menuItemStyle} text-red-500`}
                  type="button"
                  role="menuitem"
                  onClick={handleReport}
                >
                  <Flag className="w-4 h-4" />
                  Report
                </button>
              </>
            )}
          </div>,
          document.body
        )
      }

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

      {/* Local Report modal (fallback) */}
      <ReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        target={{
          type: "POST",
          id: postId,
          name: authorUsername ? `@${authorUsername}'s post` : "this post",
        }}
      />
    </div>
  );
}
