import { User, LogOut, Moon } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { NAVBAR_LABELS } from "@/constants/labels/uiLabels";
import ThemeToggleButton from "@/components/ThemeToggleButton";

const DROPDOWN_ITEM_STYLE =
  "flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-dark-card-hover transition";

export default function ProfileDropdown({ userInfo }) {
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

  const handleSignOut = () => {
    localStorage.removeItem("token");
    // 필요하면 여기서 전역 상태 초기화도 가능
    window.location.reload();
  };

  const imageUrl = userInfo?.profileImage?.imageUrl || "/default-profile.jpg";
  const positionX = userInfo?.profileImage?.imagePositionX ?? 50;
  const positionY = userInfo?.profileImage?.imagePositionY ?? 50;

  return (
    <div ref={profileRef} className="relative">
      <div
        onClick={(e) => {
          e.stopPropagation();
          setShowProfileDropdown((p) => !p);
        }}
        className="w-10 h-10 rounded-full cursor-pointer border border-gray-300 dark:border-gray-600 bg-cover bg-center"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundPosition: `${positionX}% ${positionY}%`,
        }}
      ></div>

      {showProfileDropdown && (
        <div
          className="absolute right-0 mt-2 w-44 bg-white dark:bg-dark-card-bg border border-gray-200 dark:border-gray-700 rounded shadow z-50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              navigate(ROUTES.PROFILE(userInfo.username));
              setShowProfileDropdown(false);
            }}
            className={DROPDOWN_ITEM_STYLE}
          >
            <User size={16} className="mr-2" /> {NAVBAR_LABELS.PROFILE}
          </button>

          <div className={DROPDOWN_ITEM_STYLE}>
            <Moon size={16} className="mr-2" />
            <ThemeToggleButton />
          </div>

          <button
            onClick={() => {
              handleSignOut();
              setShowProfileDropdown(false);
            }}
            className={DROPDOWN_ITEM_STYLE}
          >
            <LogOut size={16} className="mr-2" /> {NAVBAR_LABELS.SIGN_OUT}
          </button>
        </div>
      )}
    </div>
  );
}
