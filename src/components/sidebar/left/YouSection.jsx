import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SidebarItem from "@/components/sidebar/left/SidebarItem";
import { fetchMe } from "@/features/post/services/postApi";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/apiRoutes/routes";

export default function YouSection({ isOpen }) {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();

    const navigateToProfile = async () => {
    try{
      const res = await fetchMe();
      const username = res.data.data.username;
      navigate(`/profile/${username}`);
      navigate(ROUTES.PROFILE(username));
    }
    catch(err){
      console.error("Failed to fetch username", err)
    }
  }

  if (!isOpen) {    
    return (
      <>
        <SidebarItem iconKey="chat" label="Chat" isOpen={isOpen} />
        <SidebarItem iconKey="saved" label="Saved" isOpen={isOpen} />
        <SidebarItem iconKey="profile" label="Profile" isOpen={isOpen} />
      </>
    );
  }

  return (
    <div className="w-full">
      {/* Section Title with Toggle */}
      <div
        className="flex items-center justify-between px-2 cursor-pointer select-none mb-2"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <h2 className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
          You
        </h2>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </div>

      {expanded && (
        <>
          <SidebarItem iconKey="chat" label="Chat" isOpen={isOpen} />
          <SidebarItem iconKey="saved" label="Saved" isOpen={isOpen} />
          <SidebarItem iconKey="profile" label="Profile" isOpen={isOpen} onClick={navigateToProfile}/>
        </>
      )}
    </div>
  );
}
