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
      {/* Create Button */}
      <button
        onClick={() => setShowCreateMenu(true)}
        className="px-4 py-2 rounded-full text-sm text-black dark:text-white 
                   hover:bg-gray-100 dark:hover:bg-dark-action-hover transition 
                   font-medium flex items-center gap-2 border border-gray-300 dark:border-gray-700 shadow-sm"
      >
        <Plus size={26} />
        Create
      </button>

      {/* Dropdown */}
      {showCreateMenu && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-dark-card-bg shadow-xl z-50">
          <button
            onClick={() => {
              navigate(ROUTES.CREATE_POST);
              setShowCreateMenu(false);
            }}
            className="flex items-center w-full gap-3 px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 
                      hover:bg-gray-100 dark:hover:bg-dark-action-hover 
                      hover:text-black dark:hover:text-white 
                      rounded-lg transition"
          >
            <PenLine size={18} className="text-gray-500" />
            Create Post
          </button>

          <button
            onClick={() => {
              navigate(ROUTES.CREATE_COMMUNITY);
              setShowCreateMenu(false);
            }}
            className="flex items-center w-full gap-3 px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 
                      hover:bg-gray-100 dark:hover:bg-dark-action-hover 
                      hover:text-black dark:hover:text-white 
                      rounded-lg transition"
          >
            <Users size={18} className="text-gray-500" />
            Create Community
          </button>

        </div>
      )}
    </div>
  );
}
