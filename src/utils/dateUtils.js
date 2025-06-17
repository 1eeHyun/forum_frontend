
export const formatTimeAgo = (createdAt) => {
    const now = new Date();
    const postTime = new Date(createdAt);
    const timeDiff = now - postTime; // Time difference in milliseconds
  
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
  
    if (weeks > 0) {
      return `${weeks}w ago`; // Weeks
    } else if (days > 0) {
      return `${days}d ago`; // Days
    } else if (hours > 0) {
      return `${hours}h ago`; // Hours
    } else if (minutes > 0) {
      return `${minutes}m ago`; // Minutes
    } else {
      return `${seconds}s ago`; // Seconds
    }
  };
  