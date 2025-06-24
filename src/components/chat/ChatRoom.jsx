import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { subscribeRoom, sendMessage } from "@/websocket/client";
import { CHAT } from "@/constants/apiRoutes/chat";
import { ArrowLeft } from "lucide-react";

import ChatRoomMessageList from "./ChatRoomMessageList";
import useChatMessages from "@/hooks/chat/useChatMessages";
import useChatSubscription from "@/hooks/chat/useChatSubscription";

export default function ChatRoom({ roomId, onClose }) {
  const { threads, setThreads } = useContext(ChatContext);
  const { username } = useAuth();
  const [input, setInput] = useState("");

  const scrollRef = useRef(null);
  const messageRefs = useRef({});
  const subscriptionRef = useRef(null);

  // Custom hook to fetch messages and mark as read
  useChatMessages({ roomId, setThreads, scrollRef, messageRefs });
  useChatSubscription({ roomId, setThreads, scrollRef });

  // Send message
  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(roomId, {
      content: input.trim(),
      sentAt: new Date().toISOString(),
    });
    setInput("");
  };

  const thread = threads.find((t) => t.roomId === roomId);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0e1012] text-black dark:text-white">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-1 py-2 border-b border-gray-200 dark:border-gray-700">
        <button onClick={onClose} className="p-1">
          <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white" />
        </button>
        <span className="text-base font-medium">{thread?.user?.nickname || "Chat"}</span>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-3 space-y-4 custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        <ChatRoomMessageList
          messages={thread?.messages}
          currentUsername={username}
          messageRefs={messageRefs}
        />
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 h-[60px] border-t border-gray-200 dark:border-gray-700 dark:bg-[#0e1012] px-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-4 py-2 rounded-full text-sm outline-none border border-gray-300 dark:border-gray-700
            placeholder-gray-500 text-black dark:text-white bg-white dark:bg-[#1a1d21]"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className={`px-4 py-2 rounded-full text-sm transition
            ${input.trim()
              ? "text-white bg-blue-600 hover:bg-blue-700"
              : "text-gray-400 bg-gray-200 dark:bg-[#2e3239] cursor-not-allowed"}
          `}
        >
          Send
        </button>
      </div>
    </div>
  );
}
