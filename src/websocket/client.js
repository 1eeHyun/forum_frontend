import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
let connected = false;

export const connectWebSocket = (token, onMessageReceived) => {
  const socket = new SockJS(
    `${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}/ws-chat?token=${encodeURIComponent(token)}`
  );

  stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: { Authorization: `Bearer ${token}` },
    onConnect: () => {
      connected = true;
      
      stompClient.subscribe("/topic/chat.global", (message) => {
        const parsed = JSON.parse(message.body);
        onMessageReceived(parsed);
      });
    },
    onStompError: (frame) => console.error("STOMP error", frame),
  });

  stompClient.onWebSocketClose = () => {
    connected = false;
  };

  stompClient.activate();
};

export const subscribeRoom = (roomId, onRoomMessage) => {
  if (!connected || !stompClient) return;

  return stompClient.subscribe(`/topic/chat.${roomId}`, (message) => {
    const parsed = JSON.parse(message.body);
    onRoomMessage(parsed);
  });
};

export const sendMessage = (roomId, messageBody) => {
  if (!connected || !stompClient) return;

  stompClient.publish({
    destination: "/app/chat.send",
    body: JSON.stringify({ ...messageBody, roomId }),
  });
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    connected = false;
  }
};
