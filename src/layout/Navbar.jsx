import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, User, MoreVertical, LogIn, Moon } from "lucide-react";
import { AUTH } from "@/constants/apiRoutes/auth";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { NAVBAR_LABELS } from "@/constants/labels/uiLabels";
import { ICON_SIZES } from "@/constants/uiSizes";
import { useAuth } from "@/context/AuthContext";
import { ChatContext } from "@/context/ChatContext";

import axios from "@/api/axios";
import SearchBar from "@/components/navbar/SearchBar";
import CreateMenu from "@/components/navbar/CreateMenu";
import NotificationDropdown from "@/components/navbar/NotificationDropdown";
import ProfileDropdown from "@/components/navbar/ProfileDropdown";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { showErrorToast } from "@/utils/toast";

export default function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGuestMenu, setShowGuestMenu] = useState(false);
  const guestMenuRef = useRef();

  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const isLoggedIn = !!token;

  const { setIsLoggedIn } = useAuth();
  const { clearThreads } = useContext(ChatContext);

  const fetchUserInfo = async () => {
    try {
      const { method, url } = AUTH.ME;
      const res = await axios({ method, url });
      setUserInfo(res.data.data);
    } catch (err) {
      showErrorToast(NAVBAR_LABELS.FETCH_USER_ERROR);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUserInfo();
    else {
      setUserInfo(null);
      setLoading(false);
    }

    const handleTokenChange = () => {
      setUserInfo(null);
      setLoading(true);
    };

    window.addEventListener("storage", handleTokenChange);
    return () => window.removeEventListener("storage", handleTokenChange);
  }, [token]);

  const handleSignOut = async () => {
    try {
      const { method, url } = AUTH.LOGOUT;
      await axios({ method, url });
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USERNAME);
      setUserInfo(null);
      setIsLoggedIn(false);
      clearThreads();
      navigate(ROUTES.LOGIN);
    } catch (err) {
      showErrorToast(NAVBAR_LABELS.LOGOUT_ERROR);
    }
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (guestMenuRef.current && !guestMenuRef.current.contains(e.target)) {
        setShowGuestMenu(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 h-14 z-50 px-6 flex items-center justify-between
                 bg-card-bg border-b border-card text-black
                 dark:bg-dark-card-bg dark:border-dark-card dark:text-white"
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="hover:text-purple-400 transition">
          <Menu size={ICON_SIZES.MD} />
        </button>
        <h1
          className="text-xl font-bold cursor-pointer hover:text-purple-400"
          onClick={() => navigate(ROUTES.HOME)}
        >
          {NAVBAR_LABELS.TITLE}
        </h1>
      </div>

      {/* Center Section */}
      <SearchBar />

      {/* Right Section */}
      <div className="flex items-center space-x-4 relative">
        {loading ? (
          <div className="text-gray-400">{NAVBAR_LABELS.LOADING}</div>
        ) : isLoggedIn && userInfo ? (
          <>
            <CreateMenu />
            <NotificationDropdown token={token} />
            <ProfileDropdown userInfo={userInfo} onSignOut={handleSignOut} />
          </>
        ) : (
          <div className="relative" ref={guestMenuRef}>
            <button
              onClick={() => setShowGuestMenu((prev) => !prev)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <MoreVertical size={ICON_SIZES.SM} />
            </button>

            {showGuestMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card-bg border border-gray-200 dark:border-gray-700 rounded shadow z-50">
                <button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <LogIn size={ICON_SIZES.SM} /> {NAVBAR_LABELS.LOGIN}
                </button>
                <button
                  className="w-full px-4 py-3 flex items-center gap-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Moon size={ICON_SIZES.SM} />
                  <ThemeToggleButton />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
