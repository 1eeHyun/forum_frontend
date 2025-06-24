import { useEffect, useState } from "react";
import axios from "@/api/axios";
import { CHAT } from "@/constants/apiRoutes/chat";

export default function useFetchChatMessages(roomId) {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomId) return;
    const fetch = async () => {
      try {
        const { method, url } = CHAT.ROOM_MESSAGES(roomId);
        const res = await axios({ method, url });
        setMessages(Array.isArray(res.data.data) ? res.data.data : []);
        setError(null);
      } catch (err) {        
        setError("Failed to load messages.");
      }
    };

    fetch();
  }, [roomId]);

  return { messages, error };
}
