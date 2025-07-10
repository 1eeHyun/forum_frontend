import {
  MoreHorizontal,
  UserPlus,
  Bookmark,
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

export default function PostOptionsMenu({
  authorUsername,
  postId,
  onEdit,
  onDelete,
  onReport,
  onFollow,
  onSave,
  onHide,
}) {
  const [open, setOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const menuRef = useRef();
  const { username: loggedInUsername, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const isOwner =
    isLoggedIn &&
    loggedInUsername?.toLowerCase() === authorUsername?.toLowerCase();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoggedIn) return null;

  const menuItemStyle =
    "flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="ml-2 text-gray-500 hover:text-black dark:hover:text-white"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-600 rounded-md z-10">
          {isOwner ? (
            <>
              <button
                className={menuItemStyle}
                onClick={() => {
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
                onClick={() => {
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
              <button
                className={menuItemStyle}
                onClick={() => {
                  setOpen(false);
                  onFollow?.();
                }}
              >
                <UserPlus className="w-4 h-4" />
                Follow Author
              </button>
              <button
                className={menuItemStyle}
                onClick={() => {
                  setOpen(false);
                  onSave?.();
                }}
              >
                <Bookmark className="w-4 h-4" />
                Save
              </button>
              <button
                className={menuItemStyle}
                onClick={() => {
                  setOpen(false);
                  onHide?.();
                }}
              >
                <EyeOff className="w-4 h-4" />
                Hide
              </button>
              <button
                className={`${menuItemStyle} text-red-500`}
                onClick={() => {
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

      {/* Confirm Modal for Delete */}
      <ConfirmModal
        open={isConfirmOpen}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          onDelete?.();
        }}
      />
    </div>
  );
}
