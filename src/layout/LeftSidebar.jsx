import SidebarItem from "@/components/sidebar/left/SidebarItem";
import CommunitiesSection from "@/components/sidebar/left/CommunitiesSection";

export default function LeftSidebar({ isOpen }) {
  return (
    <div className={`flex flex-col ${isOpen ? "items-start" : "items-center"} w-full`}>
      <div className="w-full">
        {isOpen && (
          <h2 className="text-xs text-muted-foreground font-semibold uppercase tracking-wider px-2 mb-2">
            Home
          </h2>
        )}
        <SidebarItem iconKey="home" label="Home" isOpen={isOpen} />
        <SidebarItem iconKey="trending" label="Trending" isOpen={isOpen} />
        {isOpen && <hr className="border-border my-4 w-full" />}
      </div>

      <div className="w-full">
        <CommunitiesSection isOpen={isOpen} />
        {isOpen && <hr className="border-border my-4 w-full" />}
      </div>

      <div className="w-full">
        {isOpen && (
          <h2 className="text-xs text-muted-foreground font-semibold uppercase tracking-wider px-2 mb-2">
            You
          </h2>
        )}
        <SidebarItem iconKey="chat" label="Chat" isOpen={isOpen} />
        <SidebarItem iconKey="saved" label="Saved" isOpen={isOpen} />
        <SidebarItem iconKey="profile" label="Profile" isOpen={isOpen} />
        {isOpen && <hr className="border-border my-4 w-full" />}
      </div>
    </div>
  );
}