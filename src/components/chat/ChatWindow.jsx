import useFetchChatMessages from "@/hooks/chat/useFetchChatMessages";

export default function ChatWindow({ roomId }) {
  const { messages, error } = useFetchChatMessages(roomId);

  return (
    <div
      className="
        mt-4 p-3 rounded h-[300px] overflow-y-auto text-sm custom-scrollbar
        bg-gray-100 text-black
        dark:bg-[#121416] dark:text-white
      "
    >
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

      {messages.length === 0 && !error && (
        <div className="text-gray-500 italic">No messages yet.</div>
      )}

      {messages.map((msg) => (
        <div key={`msg-${msg.id ?? `${msg.senderUsername}-${msg.sentAt}`}`} className="mb-1">
          <span className="font-semibold">{msg.senderNickname}</span>:{" "}
          <span>{msg.content}</span>
        </div>
      ))}
    </div>
  );
}
