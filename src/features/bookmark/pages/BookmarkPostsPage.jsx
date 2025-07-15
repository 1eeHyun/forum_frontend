import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { getMyBookmarkedPosts } from "@bookmark/services/bookmarkApi";

import MainLayout from "@/layout/MainLayout";
import ProfilePostList from "@profile/components/ProfilePostList"; 

export default function BookmarkedPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBookmarkedPosts()
      .then((res) => setPosts(res.data.data))
      .catch((err) => console.error("Failed to fetch bookmarked posts", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout rightSidebar={null}>
      <div className="flex items-center gap-2 mb-2">
        <Bookmark size={20} className="text-primary" />
        <h2 className="text-xl font-semibold dark:text-white">Bookmarked Posts</h2>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-4" />

      {loading ? (
        <p className="text-muted dark:text-dark-muted">Loading bookmarked posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 italic">You haven't bookmarked any posts yet.</p>
      ) : (
        <ProfilePostList posts={posts} isSidebarOpen={false} />
      )}
    </MainLayout>
  );
}
