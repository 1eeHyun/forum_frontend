import { useState } from "react";
import Navbar from "./Navbar";
import LeftSidebar from "./LeftSidebar";

export default function MainLayout({ children, rightSidebar }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarWidth = isSidebarOpen ? 256 : 64;

  return (
    <div className="min-h-screen bg-card-bg text-black dark:bg-card-bg dark:text-white transition-colors">
      <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      {/* Left Sidebar */}
      <aside
        className={`
          fixed top-14 left-0 h-[calc(100vh-56px)] p-4 hidden md:flex flex-col
          border-r border-card bg-card-bg transition-all duration-300
        `}
        style={{ width: `${sidebarWidth}px` }}
      >
        <LeftSidebar isOpen={isSidebarOpen} />
      </aside>

      {/* Main Content + Right Sidebar */}
      <div className="pt-14 flex justify-center" style={{ marginLeft: `${sidebarWidth}px` }}>
  <div className="flex w-full max-w-[1500px] px-6 gap-2">
    <main className="flex-1 max-w-[1200px] py-6">{children}</main>
    
    <aside
      className="hidden lg:block w-[400px] p-4 space-y-4"
      style={{ marginTop: "40px" }}
    >
      {rightSidebar}
    </aside>
  </div>
</div>

    </div>
  );
}
