import { useContext, useEffect, useState, useRef } from "react";
import { ChatContext } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { subscribeRoom, sendMessage } from "@/websocket/client";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import axios from "@/api/axios";
import ChatRoomMessageList from "./ChatRoomMessageList";

export default function ChatRoom({ roomId, onClose }) {
  const { threads, setThreads } = useContext(ChatContext);
  const { username } = useAuth();
  const [input, setInput] = useState("");

  const subscriptionRef = useRef(null);
  const scrollRef = useRef(null);
  const messageRefs = useRef({});

  useEffect(() => {
    axios.get(`/chat/rooms/${roomId}/messages`)
      .then((res) => {
        const { messages, lastReadMessageId: lastReadId } = res.data.data || {};
        
        const safeMessages = Array.isArray(messages) ? messages : [];

        setThreads((prev) =>
          prev.map((thread) =>
            thread.roomId === roomId
              ? {
                  ...thread,
                  messages: safeMessages,
                  lastMessage: safeMessages.at(-1)?.content || "No messages yet",
                  lastMessageAt: safeMessages.at(-1)?.sentAt || null,
                }
              : thread
          )
        );
        
        const lastMessage = safeMessages.at(-1);            
        const lastMessageId = lastMessage?.id;        

        if (lastMessageId) {
          axios.post(`/chat/rooms/${roomId}/read`, {
            lastReadMessageId: lastMessageId,
          })
          .then(() => {            
            setThreads((prev) =>
              prev.map((thread) =>
                thread.roomId === roomId
                  ? {
                      ...thread,
                      lastReadMessageId: lastMessageId,
                    }
                  : thread
              )
            );
          })
          .catch((err) => {
            console.error("Failed to mark messages as read", err);
          });
        }

        setTimeout(() => {
          const targetMsg = safeMessages.find(msg => msg.id > lastReadId);
          const targetRef = targetMsg ? messageRefs.current[targetMsg.id] : null;

          if (targetRef) {
            targetRef.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
          }
        }, 150);
      })
      .catch((err) => console.error("Failed to fetch messages", err));
  }, [roomId, setThreads]);

  useEffect(() => {
    subscriptionRef.current = subscribeRoom(roomId, (msg) => {
      setThreads((prev) =>
        prev.map((thread) =>
          thread.roomId === roomId
            ? {
                ...thread,
                messages: [...(thread.messages || []), msg],
                lastMessage: msg.content,
                lastMessageAt: msg.sentAt,
              }
            : thread
        )
      );
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    return () => subscriptionRef.current?.unsubscribe();
  }, [roomId, setThreads]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(roomId, {
        content: input,
        sentAt: new Date().toISOString(),
      });
      setInput("");
    }
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
