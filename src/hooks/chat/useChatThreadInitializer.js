import axios from "@/api/axios";
import { CHAT } from "@/constants/apiRoutes/chat";

export default async function initializeChatThread(roomId, user, threads, setThreads) {
  const exists = threads.some((t) => t.roomId === roomId);
  if (exists) return;

  try {
    const { method, url } = CHAT.ROOM_MESSAGES(roomId);
    const res = await axios({ method, url });
    const messages = Array.isArray(res.data.data) ? res.data.data : [];
    const lastMessage = messages.at(-1);

    setThreads((prev) => [
      ...prev,
      {
        roomId,
        user,
        messages,
        lastMessage: lastMessage?.content || "No messages yet",
        lastMessageAt: lastMessage?.sentAt || null,
      },
    ]);
  } catch (err) {
    
    setThreads((prev) => [
      ...prev,
      {
        roomId,
        user,
        messages: [],
        lastMessage: "No messages yet",
        lastMessageAt: null,
      },
    ]);
  }
}
