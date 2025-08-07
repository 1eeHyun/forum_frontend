import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, LogIn, MoreVertical, Moon, User } from "lucide-react";

import { AUTH } from "@/constants/apiRoutes/auth";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { NAVBAR_LABELS } from "@/constants/labels/uiLabels";
import { NAVBAR_STYLES } from "@/constants/styles/uiStyles";
import { ICON_SIZES } from "@/constants/uiSizes";
import { useAuth } from "@/context/AuthContext";
import { ChatContext } from "@/context/ChatContext";
import { showErrorToast } from "@/utils/toast";

import axios from "@/api/axios";
import SearchBar from "@/components/navbar/SearchBar";
import CreateMenu from "@/components/navbar/CreateMenu";
import NotificationDropdown from "@/components/navbar/NotificationDropdown";
import ProfileDropdown from "@/components/navbar/ProfileDropdown";
import ThemeToggleButton from "@/components/ThemeToggleButton"; 
import LoginModal from "@/features/auth/components/LoginModal";

export default function Navbar({ onToggleSidebar }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGuestMenu, setShowGuestMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navigate = useNavigate();
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
      if (err.response?.status !== 401) {
        showErrorToast(NAVBAR_LABELS.FETCH_USER_ERROR);
      }
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
      navigate(ROUTES.HOME);
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
    <header className={NAVBAR_STYLES.HEADER}>
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="hover:text-blue-500 transition">
          <Menu size={ICON_SIZES.MD} />
        </button>

        <h1
          className={NAVBAR_STYLES.TITLE}
          onClick={() => navigate(ROUTES.HOME)}
        >
          {NAVBAR_LABELS.TITLE}
        </h1>
        
      </div>

      {/* Center Section */}
      <SearchBar />

      {/* Right Section */}
      <div className="flex items-center gap-x-2 relative">
        {loading ? (
          <div className="text-gray-400">{NAVBAR_LABELS.LOADING}</div>
        ) : isLoggedIn && userInfo ? (
          <>
            <CreateMenu />
            <NotificationDropdown token={token} />
            <ProfileDropdown userInfo={userInfo} onSignOut={handleSignOut} />
          </>
        ) : (
          <>
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <User className="w-5 h-5" />
              {NAVBAR_LABELS.LOGIN}
            </button>

            <div className="relative" ref={guestMenuRef}>
              <button
                onClick={() => setShowGuestMenu((prev) => !prev)}
                className={NAVBAR_STYLES.GUEST_MENU_BUTTON}
              >
                <MoreVertical size={ICON_SIZES.SM} />
              </button>

              {showGuestMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card-bg border border-gray-200 dark:border-gray-700 rounded shadow z-50">
                  <button
                    onClick={() => {
                      setShowGuestMenu(false);
                      setShowLoginModal(true);
                    }}
                    className={NAVBAR_STYLES.DROPDOWN_ITEM}
                  >
                    
                    <LogIn size={ICON_SIZES.SM} /> {NAVBAR_LABELS.LOGIN_SIGNUP}
                  </button>

                  <div className={NAVBAR_STYLES.DROPDOWN_ITEM}>
                    <Moon size={ICON_SIZES.SM} />
                    <ThemeToggleButton />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </header>
  );
}
