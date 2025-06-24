import { useEffect, useRef, useState, useContext } from "react";
import { ChevronDown, SquarePen } from "lucide-react";
import MessageThreadList from "./MessageThreadList";
import NewMessageModal from "./NewMessageModal";
import ChatRoom from "./ChatRoom";
import { ChatContext } from "@/context/ChatContext";
import initializeChatThread from "@/hooks/chat/useChatThreadInitializer";

export default function ChatSidebar({ isOpen, onClose }) {
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const sidebarRef = useRef(null);
  const modalRef = useRef(null);
  const { threads, setThreads } = useContext(ChatContext);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const sidebarClicked = sidebarRef.current?.contains(e.target);
      const modalClicked = modalRef.current?.contains(e.target);

      if (!sidebarClicked && !modalClicked) {
        setShowNewMessage(false);
        onClose();
        setCurrentRoomId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSelectThread = async (roomId, user = null) => {
    await initializeChatThread(roomId, user, threads, setThreads); 
    setCurrentRoomId(roomId);
  };

  const handleSelectUser = async (user, roomId) => {
    await handleSelectThread(roomId, user);
    setShowNewMessage(false);
  };

  return (
    <>
      <div
        ref={sidebarRef}
        className={`
          fixed bottom-20 right-4 w-[400px] h-[600px] rounded-xl shadow-xl overflow-hidden z-50
          flex flex-col border
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-8 opacity-0 pointer-events-none"}
          bg-white text-black border-gray-200
          dark:bg-[#0e1012] dark:text-white dark:border-gray-700
        `}
      >
        {!currentRoomId && (
          <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="font-semibold">Messages</div>
            <div className="flex gap-3 items-center">
              <button
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-[#2a2e34] transition"
                onClick={() => setShowNewMessage((prev) => !prev)}
              >
                <SquarePen className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white" />
              </button>
              <button onClick={onClose}>
                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition" />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 custom-scrollbar bg-white dark:bg-transparent">
          {currentRoomId ? (
            <ChatRoom
              roomId={currentRoomId}
              onClose={() => setCurrentRoomId(null)}
            />
          ) : (
            <MessageThreadList onSelectThread={handleSelectThread} />
          )}
        </div>
      </div>

      {isOpen && showNewMessage && !currentRoomId && (
        <div className="fixed bottom-20 right-[424px] z-50 transition duration-300 ease-in-out">
          <NewMessageModal
            modalRef={modalRef}
            onClose={() => setShowNewMessage(false)}
            onSelectUser={handleSelectUser}
          />
        </div>
      )}
    </>
  );
}
