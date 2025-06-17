export const NOTIFICATIONS = {
    LIST: { method: "get", url: "/notifications" },
    MARK_ALL_READ: { method: "post", url: "/notifications/read-all" },
    RESOLVE: (notificationId) => ({ method: "get", url: `/notifications/${notificationId}/resolve` }),
  };
  