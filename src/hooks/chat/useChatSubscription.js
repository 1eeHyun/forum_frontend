import { useEffect } from "react";
import { subscribeRoom } from "@/websocket/client";

export default function useChatSubscription({ roomId, setThreads, scrollRef }) {
  useEffect(() => {
    const subscription = subscribeRoom(roomId, (msg) => {
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

    return () => subscription?.unsubscribe();
  }, [roomId, setThreads, scrollRef]);
}
