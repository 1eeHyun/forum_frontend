import { useState } from "react";
import Navbar from "./Navbar";
import LeftSidebar from "./LeftSidebar";

export default function MainLayout({ children, rightSidebar }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarWidth = isSidebarOpen ? 256 : 64; // 64px or 16rem

  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      {/* Left sidebar (Fixed) */}
      <aside
        className={`fixed top-14 left-0 h-[calc(100vh-56px)] border-r border-gray-700 bg-zinc-900 p-4 hidden md:flex flex-col transition-all duration-300`}
        style={{ width: `${sidebarWidth}px` }}
      >
        <LeftSidebar isOpen={isSidebarOpen} />
      </aside>

      {/* Contents */}
      <div
        className="pt-14 flex"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >        
        <main className="flex-1 py-6 px-6">
          {children}
        </main>

        {/* Right sidebar */}
        <aside className="hidden lg:block w-[400px] border-l border-gray-700 p-4 space-y-4">
          {rightSidebar}
        </aside>
      </div>
    </div>
  );
}
