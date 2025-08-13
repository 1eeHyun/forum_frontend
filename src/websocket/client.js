import { Client } from "@stomp/stompjs";

let stompClient = null;
let connected = false;

// Helper: HTTP → WS 변환
const toWebSocketUrl = (httpUrl) => {
  try {
    const url = new URL(httpUrl);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.pathname = "/ws-chat";
    return url.toString();
  } catch (err) {
    console.error("Invalid API base URL", err);
    return null;
  }
};

export const connectWebSocket = (token, onMessageReceived) => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const socketUrl = `${toWebSocketUrl(apiBaseUrl)}?token=${encodeURIComponent(token)}`;

  stompClient = new Client({
    brokerURL: socketUrl,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    reconnectDelay: 5000,
    onConnect: () => {
      connected = true;
      stompClient.subscribe("/topic/chat.global", (message) => {
        const parsed = JSON.parse(message.body);
        onMessageReceived(parsed);
      });
    },
    onStompError: () => {},
    onWebSocketClose: () => {
      connected = false;
    },
    debug: () => {},
  });

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
