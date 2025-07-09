import SidebarItem from "@/components/sidebar/left/SidebarItem";
import CommunitiesSection from "@/components/sidebar/left/CommunitiesSection";
import YouSection from "@/components/sidebar/left/YouSection";

export default function LeftSidebar({ isOpen }) {
  return (
    <div className={`flex flex-col ${isOpen ? "items-start" : "items-center"} w-full`}>
      {/* Home Section */}
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

      {/* Communities Section */}
      <div className="w-full">
        <CommunitiesSection isOpen={isOpen} />
        {isOpen && <hr className="border-border my-4 w-full" />}
      </div>

      {/* You Section */}
      <div className="w-full">
        <YouSection isOpen={isOpen} />
        {isOpen && <hr className="border-border my-4 w-full" />}
      </div>
    </div>
  );
}
