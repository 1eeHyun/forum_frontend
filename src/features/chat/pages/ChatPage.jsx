import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { ChatContext } from "@/context/ChatContext";
import MessageThreadList from "@/components/chat/MessageThreadList";
import ChatRoom from "@/components/chat/ChatRoom";
import useFetchUsers from "@/hooks/chat/useFetchUsers";
import MainLayout from "@/layout/MainLayout";
import axios from "@/api/axios";

export default function ChatPage() {
  const { roomId } = useParams();
  const { threads, setThreads } = useContext(ChatContext);
  const [selectedRoomId, setSelectedRoomId] = useState(roomId);
  const [search, setSearch] = useState("");

  const users = useFetchUsers(search);

  const handleSelectUser = async (user) => {
    try {
      const res = await axios.post("/api/chat/rooms", null, {
        params: { targetUsername: user.username },
      });
      const roomId = res.data.data;

      const alreadyExists = threads.some((t) => t.roomId === roomId);
      if (!alreadyExists) {
        setThreads((prev) => [...prev, { roomId, user, messages: [] }]);
      }

      setSelectedRoomId(roomId);
    } catch (err) {
      console.error("Failed to create room", err);
    }
  };

  const handleSelectThread = (roomId) => {
    setSelectedRoomId(roomId);
  };

  return (
    <MainLayout rightSidebar={null}>
    <div className="flex h-[calc(100vh-60px)] gap-2">
        {/* Left panel: Thread list + search */}
        <div className="w-[320px] pr-5 flex flex-col border-r border-gray-300 dark:border-gray-700">

          {/* Message thread list */}
          <div className="flex-1 overflow-y-auto border-b border-gray-300 dark:border-gray-700">
            <MessageThreadList onSelectThread={handleSelectThread} />
          </div>

          {/* Search input moved to bottom */}
          <div className="p-4 border-t border-gray-300 dark:border-gray-700">
            {/* User search results */}
          {search && (
            <div className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">
              <p className="text-xs text-gray-500 mb-1">Search Results</p>
              <div className="space-y-1">
                {users.map((user) => (
                  <div
                    key={user.username}
                    onClick={() => handleSelectUser(user)}
                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1f2124]"
                  >
                    <img
                      src={user.imageDto?.imageUrl || "/default.png"}
                      onError={(e) => {
                        e.target.src = "/default.png";
                      }}
                      alt="profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.nickname}</span>
                      <span className="text-xs text-gray-500">@{user.username}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full px-3 py-2 text-sm rounded-full bg-gray-100 dark:bg-[#1c1e21] text-black dark:text-white"
            />
          </div>          
        </div>

        {/* Right panel: ChatRoom */}        
        <div className="flex-1 h-full border-r border-gray-300 dark:border-gray-700">
            {selectedRoomId ? (
                <ChatRoom roomId={selectedRoomId} />
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
                Select a conversation to start chatting
                </div>
            )}
    </div>
  </div>
</MainLayout>
  );
}
