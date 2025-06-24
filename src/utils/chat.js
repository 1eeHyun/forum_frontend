import {
    formatDistanceToNowStrict,
    differenceInSeconds,
    differenceInHours,
    format,
  } from "date-fns";
  
  export const getRelativeTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = differenceInSeconds(now, date);
    const hours = differenceInHours(now, date);
  
    if (seconds < 60)
      return formatDistanceToNowStrict(date, { unit: "second", addSuffix: true });
    if (hours < 24)
      return formatDistanceToNowStrict(date, { addSuffix: true });
  
    return format(date, "yyyy-MM-dd");
  };
  
  export const getLastMessageAndTime = (thread) => {
    if (thread.lastMessage && thread.lastMessageAt) {
      return { content: thread.lastMessage, time: thread.lastMessageAt };
    }
    const last = thread.messages?.at(-1);
    return {
      content: last?.content || "No messages yet",
      time: last?.sentAt || null,
    };
  };
  
  export const getUnreadCount = (thread, currentUsername) => {
    const lastReadId = thread.lastReadMessageId || 0;
    return (thread.messages || []).filter(
      (msg) => msg.id > lastReadId && msg.senderUsername !== currentUsername
    ).length;
  };
  