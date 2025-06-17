import { Plus } from "lucide-react";
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
        onClick={() => setShowCreateMenu((p) => !p)}
        className="flex items-center gap-1 text-gray-300 hover:text-purple-400"
      >
        <Plus size={16} /> Create
      </button>

      {showCreateMenu && (
        <div className="absolute right-0 mt-2 w-44 bg-[#1a1c1f] border border-gray-700 rounded shadow z-50">
          <button
            onClick={() => {
              navigate(ROUTES.CREATE_POST);
              setShowCreateMenu(false);
            }}
            className="w-full px-4 py-2 hover:bg-gray-700 text-left text-white"
          >
            Post
          </button>
          <button
            onClick={() => {
              navigate(ROUTES.CREATE_COMMUNITY);
              setShowCreateMenu(false);
            }}
            className="w-full px-4 py-2 hover:bg-gray-700 text-left text-white"
          >
            Community
          </button>
        </div>
      )}
    </div>
  );
}
