import { useEffect, useState } from "react";
import axios from "@/api/axios";

export default function ChatWindow({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios
      .get(`/chat/rooms/${roomId}/messages`)
      .then((res) => setMessages(res.data.data))
      .catch((err) => console.error("Failed to fetch messages", err));
  }, [roomId]);

  return (
    <div
      className="
        mt-4 p-3 rounded h-[300px] overflow-y-auto text-sm custom-scrollbar
        bg-gray-100 text-black
        dark:bg-[#121416] dark:text-white
      "
    >
      {messages.map((msg, i) => (
        <div key={i} className="mb-1">
          <strong className="font-semibold">{msg.senderNickname}</strong>:{" "}
          {msg.content}
        </div>
      ))}
    </div>
  );
}
