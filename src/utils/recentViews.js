const RECENT_KEY = "recentlyViewedPostIds";

export function saveViewedPostId(postId) {    

  const stored = localStorage.getItem(RECENT_KEY);
  const ids = stored ? JSON.parse(stored) : [];
  
  const updated = [postId, ...ids.filter((id) => id !== postId)].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

export function getViewedPostIds() {
  const stored = localStorage.getItem(RECENT_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function clearViewedPostIds() {
  localStorage.removeItem(RECENT_KEY);
}