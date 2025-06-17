import LeftSidebar from "./LeftSidebar";

export default function ThreeColumnLayout({ children, rightSidebar, isSidebarOpen }) {
  return (
    <div className="flex w-full max-w-7xl mx-auto px-4 pt-14 gap-6">
      {/* Left sidebar */}
      <aside
        className={`hidden md:flex flex-col transition-all duration-300
          border-r border-gray-700 p-4
          ${isSidebarOpen ? "w-64" : "w-16"}
        `}
      >
        <LeftSidebar isOpen={isSidebarOpen} />
      </aside>

      {/* Content */}
      <main className="flex-1 py-6">
        {children}
      </main>

      {/* Right sidebar */}
      <aside className="hidden lg:block w-[400px] border-l border-gray-700 p-4 space-y-4">
        {rightSidebar}
      </aside>
    </div>
  );
}
