// src/features/home/pages/HomePage.jsx

import { useEffect, useState } from "react";
import { getHomePosts } from "../services/homeApi";

import MainLayout from "@/layout/MainLayout";
import HomeRightSidebar from "../components/sidebar/HomeRightSidebar";
import PostList from "@/features/post/components/list/PostList";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomePosts()
      .then((res) => {
        setPosts(res.data.data);        
      })
      .catch((err) => {
        console.error("Failed to fetch posts", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout rightSidebar={<HomeRightSidebar />}>
      {loading ? (
        <p className="text-muted dark:text-dark-muted">Loading posts...</p>
      ) : (
        <PostList posts={posts} />
      )}
    </MainLayout>
  );
}
