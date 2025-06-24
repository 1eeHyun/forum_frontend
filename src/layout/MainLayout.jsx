import { useState, useContext } from "react";
import Navbar from "./Navbar";
import LeftSidebar from "./LeftSidebar";
import ChatFloatingButton from "@/components/chat/ChatFloatingButton";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { ChatContext } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";

export default function MainLayout({ children, rightSidebar }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  const { isLoggedIn } = useAuth();
  const { threads } = useContext(ChatContext);
  
  const sidebarWidth = isSidebarOpen ? 256 : 64;
  const currentUsername = localStorage.getItem("username");

  // Calculate total unread messages across all threads
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
          <main className={`flex-1 py-6 ${rightSidebar ? "max-w-[1200px]" : "max-w-[1500px]"}`}>
            {children}
          </main>

          {rightSidebar && (
            <aside className="hidden lg:block w-[400px] p-4 space-y-4" style={{ marginTop: "40px" }}>
              {rightSidebar}
            </aside>
          )}
        </div>
      </div>
      
      {/* Chat floating button */}
      {isLoggedIn && (
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
