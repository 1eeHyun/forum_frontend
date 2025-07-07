import { Client } from "@stomp/stompjs";

let stompClient = null;
let connected = false;

export const connectWebSocket = (token, onMessageReceived) => {
  const socketUrl = `ws://localhost:8080/ws-chat?token=${encodeURIComponent(token)}`;

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
    onStompError: (frame) => {      
    },
    onWebSocketClose: () => {
      connected = false;      
    },
    debug: (str) => {
      // console.log(`[STOMP DEBUG] ${str}`);
    },
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
