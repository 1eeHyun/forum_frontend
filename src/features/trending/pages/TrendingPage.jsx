import { useState, useEffect } from "react";
import MainLayout from "@/layout/MainLayout";
import PostList from "@post/components/list/PostList";
import TrendingRightSidebar from "@trending/components/sidebar/TrendingRightSidebar";
import { getTrendingPosts } from "@trending/services/trendingApi";
import { LoaderCircle, Flame } from "lucide-react";

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
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 pb-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          <Flame className="text-orange-500 dark:text-orange-400 w-6 h-6" />
          <h1 className="text-2xl font-bold tracking-tight dark:text-white">
            Trending Posts
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 animate-pulse">
            <LoaderCircle className="w-5 h-5 animate-spin" />
            <span>Loading trending posts...</span>
          </div>
        ) : posts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No trending posts found.</p>
        ) : (
          <PostList posts={posts} />
        )}
      </div>
    </MainLayout>
  );
}
