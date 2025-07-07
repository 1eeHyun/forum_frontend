import { createContext, useState, useEffect } from "react";
import { connectWebSocket, disconnectWebSocket } from "@/websocket/client";
import axios from "@/api/axios";
import { AUTH } from "@/constants/apiRoutes";

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [threads, setThreads] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const clearThreads = () => setThreads([]);

  // Listen for token changes in localStorage
  useEffect(() => {
    const onStorage = () => {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
      if (!newToken) clearThreads();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!token) {
      clearThreads();
      return;
    }

    let unsubscribeWebSocket = () => {};

    const initializeChat = async () => {
      try {        
        await axios(AUTH.ME);
        
        const roomsRes = await axios.get("/chat/rooms/my");
        const rooms = roomsRes.data.data;

        const threadsWithMessages = await Promise.all(
          rooms.map(async (room) => {
            const messagesRes = await axios.get(`/chat/rooms/${room.roomId}/messages`);
            const { messages, lastReadMessageId } = messagesRes.data.data;

            return {
              roomId: room.roomId,
              user: room.user,
              messages,
              lastReadMessageId,
            };
          })
        );

        setThreads(threadsWithMessages);

        // ✅ WebSocket 연결
        unsubscribeWebSocket = connectWebSocket(token, (msg) => {
          setThreads((prev) => {
            const existingThread = prev.find((t) => t.roomId === msg.roomId);
            if (existingThread) {
              return prev.map((t) =>
                t.roomId === msg.roomId
                  ? { ...t, messages: [...t.messages, msg] }
                  : t
              );
            } else {
              return [
                ...prev,
                {
                  roomId: msg.roomId,
                  user: msg.senderProfile,
                  messages: [msg],
                  lastReadMessageId: 0,
                },
              ];
            }
          });
        });
      } catch (err) {
        if (err.response?.status !== 401) {
        }
        clearThreads();
      }
    };

    initializeChat();

    return () => {
      disconnectWebSocket();
      unsubscribeWebSocket?.();
    };
  }, [token]);

  return (
    <ChatContext.Provider value={{ threads, setThreads, clearThreads }}>
      {children}
    </ChatContext.Provider>
  );
}
