import { useState, useEffect } from "react";
import MainLayout from "@/layout/MainLayout";
import PostList from "@post/components/list/PostList";
import TrendingRightSidebar from "@trending/components/sidebar/TrendingRightSidebar";
import { getTrendingPosts } from "@trending/services/trendingApi";

export default function TrendingPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await getTrendingPosts();
        setPosts(res.data.data);
      } catch (err) {
        console.error("Failed to fetch trending posts", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, []);

  return (
    <MainLayout rightSidebar={<TrendingRightSidebar />}>
      <div className="px-2 md:px-0">
        <h1 className="text-xl font-semibold mb-4 dark:text-white">🔥 Trending Posts</h1>

        {loading ? (
          <p className="text-muted dark:text-dark-muted">Loading trending posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-muted dark:text-dark-muted">No trending posts found.</p>
        ) : (
          <PostList posts={posts} />
        )}
      </div>
    </MainLayout>
  );
}
