import SidebarItem from "@/components/sidebar/left/SidebarItem";
import CommunitiesSection from "@/components/sidebar/left/CommunitiesSection";
import YouSection from "@/components/sidebar/left/YouSection";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";
import useLoginModal from "@/hooks/auth/useLoginModal";
import { ROUTES } from "@/constants/apiRoutes/routes";

export default function LeftSidebar({ isOpen }) {
  const { isLoggedIn, username } = useAuth();
  const navigate = useNavigate();
  const { open: openLoginModal } = useLoginModal();

  const handleProtectedClick = (path) => {
    if (!isLoggedIn) {
      openLoginModal();
    } else {
      navigate(path);
    }
  };

  return (
    <div className={`flex flex-col ${isOpen ? "items-start" : "items-center"} w-full`}>
      {/* Home Section */}
      <div className="w-full">
        {isOpen && (
          <h2 className="text-xs text-muted-foreground font-semibold uppercase tracking-wider px-2 mb-2">
            Home
          </h2>
        )}
        <SidebarItem
          iconKey="home"
          label="Home"
          isOpen={isOpen}
          onClick={() => navigate("/")}
        />
        <SidebarItem
          iconKey="trending"
          label="Trending"
          isOpen={isOpen}
          onClick={() => navigate("/trending")}
        />
        {isOpen && <hr className="border-border my-4 w-full" />}
      </div>

      {/* User not logged-in */}
      {!isLoggedIn && isOpen && (
        <button
          onClick={openLoginModal}
          className="flex items-center gap-2 px-4 py-1.5 border border-black-500 text-black-500 rounded-full text-sm font-semibold hover:bg-blue-500 hover:text-white transition-colors"
        >
          <User className="w-5 h-5" />
          Sign in
        </button>
      )}

      {/* When Sidebar is not open */}
      {!isOpen && isLoggedIn && (
        <>
          <SidebarItem
            iconKey="chat"
            label="Chat"
            isOpen={isOpen}
            onClick={() => handleProtectedClick(ROUTES.CHAT)}
          />
          <SidebarItem
            iconKey="saved"
            label="Saved"
            isOpen={isOpen}
            onClick={() => handleProtectedClick(ROUTES.BOOKMARKS)}
          />
          <SidebarItem
            iconKey="profile"
            label="Profile"
            isOpen={isOpen}
            onClick={() => handleProtectedClick(ROUTES.PROFILE(username))}
          />
          <SidebarItem
            iconKey="community"
            label="Communities"
            isOpen={isOpen}
            onClick={() => handleProtectedClick(ROUTES.MY_COMMUNITY)}
          />
        </>
      )}
      
      {isLoggedIn && isOpen && (
        <>
          <div className="w-full">
            <CommunitiesSection isOpen={isOpen} />
            <hr className="border-border my-4 w-full" />
          </div>
          <div className="w-full">
            <YouSection isOpen={isOpen} />
            <hr className="border-border my-4 w-full" />
          </div>
        </>
      )}
    </div>
  );
}
