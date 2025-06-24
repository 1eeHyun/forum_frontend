import { useContext } from "react";
import { ChatContext } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import {
  formatDistanceToNowStrict,
  differenceInSeconds,
  differenceInHours,
  format,
} from "date-fns";

export default function MessageThreadList({ onSelectThread }) {
  const { threads } = useContext(ChatContext);
  const { username: currentUsername } = useAuth();

  const calculateUnreadCount = (thread) => {
    const lastReadId = thread.lastReadMessageId || 0;
    const messages = thread.messages || [];
    return messages.filter(
      (msg) => msg.id > lastReadId && msg.senderUsername !== currentUsername
    ).length;
  };

  const getLastMessage = (thread) => {
    if (thread.lastMessage) return thread.lastMessage;
    if (thread.messages?.length > 0)
      return thread.messages[thread.messages.length - 1].content;
    return "No messages yet";
  };

  const getLastMessageAt = (thread) => {
    if (thread.lastMessageAt) return thread.lastMessageAt;
    if (thread.messages?.length > 0)
      return thread.messages[thread.messages.length - 1].sentAt;
    return null;
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const secondsDiff = differenceInSeconds(now, date);
    const hoursDiff = differenceInHours(now, date);

    if (secondsDiff < 60) {
      return formatDistanceToNowStrict(date, { unit: "second", addSuffix: true });
    }

    if (hoursDiff < 24) {
      return formatDistanceToNowStrict(date, { addSuffix: true });
    }

    return format(date, "yyyy-MM-dd");
  };

  return (
    <div className="overflow-auto">
      {threads.map((thread) => {
        const unreadCount = calculateUnreadCount(thread);
        return (
          <div
            key={thread.roomId}
            onClick={() => onSelectThread(thread.roomId)}
            className="
              flex items-center gap-3 p-3 cursor-pointer transition rounded-xl
              hover:bg-gray-200 dark:hover:bg-[#1a1e24]
              bg-white dark:bg-transparent
            "
          >
            <img
              src={thread.user.imageDto?.imageUrl || "/default.png"}
              className="w-10 h-10 rounded-full object-cover"
              alt="profile"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-medium text-sm text-black dark:text-white truncate">
                  {thread.user.nickname}
                </p>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {getRelativeTime(getLastMessageAt(thread))}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {getLastMessage(thread)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
