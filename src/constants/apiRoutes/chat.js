export const CHAT = {
    ROOMS: { method: "GET", url: "/chat/rooms" },
    ROOM_MESSAGES: (roomId) => ({ method: "GET", url: `/chat/rooms/${roomId}/messages` }),
    MARK_AS_READ: (roomId) => ({ method: "POST", url: `/chat/rooms/${roomId}/read` }),
    CREATE_ROOM: { method: "POST", url: "/chat/rooms" },
};
  