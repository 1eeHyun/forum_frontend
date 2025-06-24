import { useEffect } from "react";
import axios from "@/api/axios";
import { CHAT } from "@/constants/apiRoutes/chat";

export default function useChatMessages({ roomId, setThreads, scrollRef, messageRefs }) {
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { method, url } = CHAT.ROOM_MESSAGES(roomId);
        const res = await axios({ method, url });
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

        const lastMessageId = safeMessages.at(-1)?.id;
        if (lastMessageId) {
          const readReq = CHAT.MARK_AS_READ(roomId);
          await axios({ ...readReq, data: { lastReadMessageId: lastMessageId } });

          setThreads((prev) =>
            prev.map((thread) =>
              thread.roomId === roomId
                ? { ...thread, lastReadMessageId: lastMessageId }
                : thread
            )
          );
        }

        setTimeout(() => {
          const targetMsg = safeMessages.find((msg) => msg.id > lastReadId);
          const targetRef = targetMsg ? messageRefs.current[targetMsg.id] : null;
          if (targetRef) {
            targetRef.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
          }
        }, 150);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    fetchMessages();
  }, [roomId]);
}
