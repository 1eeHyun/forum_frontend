import { Plus, PenLine, Users } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/apiRoutes/routes";

export default function CreateMenu() {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const createRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!createRef.current?.contains(e.target)) {
        setShowCreateMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={createRef} className="relative">
      <button
        onClick={() => setShowCreateMenu(true)}
        className="px-1 py-2 rounded-md text-sm text-black dark:text-white hover:bg-gray-200 dark:hover:bg-dark-action-hover transition font-medium flex items-center gap-1"
      >
        <Plus size={16} /> Create
      </button>

      {showCreateMenu && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-dark-card-bg shadow-xl z-50">
          <button
            onClick={() => {
              navigate(ROUTES.CREATE_POST);
              setShowCreateMenu(false);
            }}
            className="flex items-center w-full gap-3 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-card-hover transition"
          >
            <PenLine size={16} />
            Create Post
          </button>

          <button
            onClick={() => {
              navigate(ROUTES.CREATE_COMMUNITY);
              setShowCreateMenu(false);
            }}
            className="flex items-center w-full gap-3 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-card-hover transition"
          >
            <Users size={16} />
            Create Community
          </button>
        </div>
      )}
    </div>
  );
}
