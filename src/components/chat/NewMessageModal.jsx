import axios from "@/api/axios";
import { CHAT } from "@/constants/apiRoutes/chat";
import { ChatContext } from "@/context/ChatContext";
import { useEffect, useRef, useState, useContext } from "react";
import { ArrowLeft, Send } from "lucide-react";

import useFetchUsers from "@/hooks/chat/useFetchUsers";

export default function NewMessageModal({ modalRef, onClose, onSelectUser }) {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const inputRef = useRef();
  const { setThreads } = useContext(ChatContext);

  const users = useFetchUsers(search);

  const handleSend = async () => {
    if (!selectedUser) return;

    try {
      const res = await axios({
        ...CHAT.CREATE_ROOM,
        data: {
          user2Username: selectedUser.username,
        },
      });

      const roomId = res.data.data;

      setThreads((prev) => {
        if (prev.find((t) => t.roomId === roomId)) return prev;
        return [...prev, { roomId, user: selectedUser, messages: [] }];
      });

      onSelectUser(selectedUser, roomId);
      onClose();
    } catch (err) {
      console.error("Failed to create room", err);
    }
  };

  return (
    <div
      ref={modalRef}
      className="w-[375px] bg-white dark:bg-[#111417] text-black dark:text-white rounded-xl p-4 shadow-2xl border border-gray-300 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#2a2e34] transition">
          <ArrowLeft className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        </button>
        <span className="text-base font-bold">New Message</span>
        <button onClick={handleSend} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#2a2e34] transition">
          <Send className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        </button>
      </div>

      {/* To Input */}
      <div className="flex items-center bg-gray-100 dark:bg-[#1c1e21] rounded-full px-4 py-3 mb-4">
        <span className="text-sm mr-2 text-gray-500 dark:text-gray-400">To:</span>
        <input
          ref={inputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => inputRef.current?.select()}
          placeholder="Search..."
          className="bg-transparent text-sm outline-none w-full text-black dark:text-white placeholder-gray-500"
        />
      </div>

      {/* Label */}
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
        {search.trim() === "" ? "Suggested" : "Search Results"}
      </p>

      {/* User List */}
      <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
        {users.map((user) => (
          <div
            key={user.username}
            onClick={() =>
              setSelectedUser((prev) =>
                prev?.username === user.username ? null : user
              )
            }
            className={`flex items-center justify-between px-3 py-1.5 rounded-lg cursor-pointer
            ${
              selectedUser?.username === user.username
                ? "bg-gray-200 dark:bg-[#2f3237]"
                : "hover:bg-gray-100 dark:hover:bg-[#1f2124]"
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={user.imageDto?.imageUrl || "/default.png"}
                onError={(e) => {
                  e.target.src = "/default.png";
                }}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-sm">{user.nickname}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</span>
              </div>
            </div>
            {selectedUser?.username === user.username && (
              <div className="w-5 h-5 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[11px] hover:bg-opacity-80">
                ✓
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
