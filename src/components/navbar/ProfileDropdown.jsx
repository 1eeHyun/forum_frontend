import { User, LogOut } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/apiRoutes/routes";

export default function ProfileDropdown({ userInfo, onSignOut }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!profileRef.current?.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const imageUrl = userInfo?.profileImage?.imageUrl || "/default-profile.jpg";
  const positionX = userInfo?.profileImage?.imagePositionX ?? 50;
  const positionY = userInfo?.profileImage?.imagePositionY ?? 50;

  return (
    <div ref={profileRef} className="relative">
      <div
        onClick={() => setShowProfileDropdown((p) => !p)}
        className="w-10 h-10 rounded-full cursor-pointer border border-gray-400 bg-cover bg-center"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundPosition: `${positionX}% ${positionY}%`,
        }}
      ></div>

      {showProfileDropdown && (
        <div className="absolute right-0 mt-2 w-40 bg-[#1a1c1f] border border-gray-700 rounded shadow z-50">
          <button
            onClick={() => {
              navigate(ROUTES.PROFILE(userInfo.username));
              setShowProfileDropdown(false);
            }}
            className="flex items-center w-full px-4 py-2 hover:bg-gray-700 text-white"
          >
            <User size={16} className="mr-2" /> Profile
          </button>
          <button
            onClick={() => {
              onSignOut();
              setShowProfileDropdown(false);
            }}
            className="flex items-center w-full px-4 py-2 hover:bg-gray-700 text-white"
          >
            <LogOut size={16} className="mr-2" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
