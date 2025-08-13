import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { connectWebSocket, disconnectWebSocket } from "@/websocket/client";
import axios from "@/api/axios";
import { AUTH } from "@/constants/apiRoutes";

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  // === data state ===
  const [threads, setThreads] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // === UI state for floating chat ===
  const [isOpen, setIsOpen] = useState(false);           // whether floating chat is open
  const [selectedRoomId, setSelectedRoomId] = useState(null); // focused room id

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
        // Verify token
        await axios(AUTH.ME);

        // Load my rooms
        const roomsRes = await axios.get("/chat/rooms/my");
        const rooms = roomsRes.data.data;

        // Load messages per room
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

        // Connect WebSocket
        unsubscribeWebSocket = connectWebSocket(token, (msg) => {
          setThreads((prev) => {
            const idx = prev.findIndex((t) => t.roomId === msg.roomId);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = { ...next[idx], messages: [...next[idx].messages, msg] };
              return next;
            }
            // If message for unknown room arrives, create minimal thread
            return [
              ...prev,
              {
                roomId: msg.roomId,
                user: msg.senderProfile,
                messages: [msg],
                lastReadMessageId: 0,
              },
            ];
          });
        });
      } catch (err) {
        // If unauthorized or other errors, reset chat state
        clearThreads();
      }
    };

    initializeChat();

    return () => {
      disconnectWebSocket();
      unsubscribeWebSocket?.();
    };
  }, [token]);

  // === floating chat controls ===
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const select = useCallback((roomId) => {
    setSelectedRoomId(roomId);
    setIsOpen(true);
  }, []);

  /**
   * Ensure a DM room exists (create or get) for given username, then open chat and focus it.
   * @param {string} username - target username to DM
   * @param {object|null} presetUser - optional peer summary for immediate UI rendering
   * @returns {Promise<string>} roomId
   */
  const ensureRoomAndOpenByUsername = useCallback(
    async (username, presetUser = null) => {
      const res = await axios.post("/chat/rooms", null, { params: { targetUsername: username } });
      const roomId = res?.data?.data;
      if (!roomId) throw new Error("Room id missing from response");

      setThreads((prev) => {
        if (prev.some((t) => t.roomId === roomId)) return prev;
        const user = presetUser ?? { username, nickname: username, imageDto: null };
        return [...prev, { roomId, user, messages: [], lastReadMessageId: 0 }];
      });

      setSelectedRoomId(roomId);
      setIsOpen(true);
      return roomId;
    },
    []
  );

  const ctxValue = useMemo(
    () => ({
      // data
      threads,
      setThreads,
      clearThreads,
      // ui
      isOpen,
      selectedRoomId,
      open,
      close,
      select,
      // helper
      ensureRoomAndOpenByUsername,
    }),
    [threads, isOpen, selectedRoomId, open, close, select, ensureRoomAndOpenByUsername]
  );

  return <ChatContext.Provider value={ctxValue}>{children}</ChatContext.Provider>;
}
