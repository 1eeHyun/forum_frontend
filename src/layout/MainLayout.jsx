import { useState, useContext } from "react";
import Navbar from "./Navbar";
import LeftSidebar from "./LeftSidebar";
import ChatFloatingButton from "@/components/chat/ChatFloatingButton";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { ChatContext } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";

// Read sidebar state from localStorage on initial load
const getInitialSidebarState = () => {
  const stored = localStorage.getItem("leftSidebarOpen");
  return stored === null ? true : stored === "true";
};

export default function MainLayout({ children, rightSidebar, noSidebar = false }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(getInitialSidebarState);
  const [chatOpen, setChatOpen] = useState(false);

  const { isLoggedIn } = useAuth();
  const { threads } = useContext(ChatContext);

  const sidebarWidth = isSidebarOpen ? 256 : 64;
  const currentUsername = localStorage.getItem("username");

  const toggleSidebar = () => {
    const nextState = !isSidebarOpen;
    setIsSidebarOpen(nextState);
    localStorage.setItem("leftSidebarOpen", nextState.toString());
  };

  const totalUnreadCount = threads.reduce((count, thread) => {
    const lastReadId = thread.lastReadMessageId || 0;
    const messages = thread.messages || [];
    const unread = messages.filter(
      (msg) => msg.id > lastReadId && msg.senderUsername !== currentUsername
    ).length;
    return count + unread;
  }, 0);

  return (
    <div className="min-h-screen bg-card-bg text-black dark:bg-card-bg dark:text-white transition-colors">
      <Navbar onToggleSidebar={toggleSidebar} />

      {!noSidebar && (
        <aside
          className={`
            fixed top-14 left-0 h-[calc(100vh-56px)] p-4 hidden md:flex flex-col
            border-r border-card bg-card-bg transition-all duration-300
          `}
          style={{ width: `${sidebarWidth}px` }}
        >
          <LeftSidebar isOpen={isSidebarOpen} />
        </aside>
      )}

      <div className="pt-14 flex justify-center" style={{ marginLeft: noSidebar ? 0 : `${sidebarWidth}px` }}>
        <div className="flex w-full max-w-[1500px] px-6 gap-2">
          <main className={`flex-1 py-6 ${rightSidebar && !noSidebar ? "max-w-[1200px]" : "max-w-[1500px]"}`}>
            {children}
          </main>

          {!noSidebar && rightSidebar && (
            <aside className="hidden lg:block w-[400px] p-4 space-y-4" style={{ marginTop: "40px" }}>
              {rightSidebar}
            </aside>
          )}
        </div>
      </div>

      {isLoggedIn && !noSidebar && (
        <>
          <ChatFloatingButton
            onClick={() => setChatOpen((prev) => !prev)}
            unreadCount={totalUnreadCount}
          />
          <ChatSidebar isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </>
      )}
    </div>
  );
}
