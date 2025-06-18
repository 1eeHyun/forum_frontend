import { useState, useEffect, useRef } from "react";
import { AlignLeft } from "lucide-react";
import { getHomePosts } from "../services/homeApi";

import MainLayout from "@/layout/MainLayout";
import HomeRightSidebar from "../components/sidebar/HomeRightSidebar";
import PostList from "@/features/post/components/list/PostList";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("latest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortRef = useRef();

  useEffect(() => {
    getHomePosts()
      .then((res) => setPosts(res.data.data))
      .catch((err) => console.error("Failed to fetch posts", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showSortDropdown && sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSortDropdown(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSortDropdown]);

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortOption === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortOption === "top") return (b.likeCount || 0) - (a.likeCount || 0);
    return 0;
  });

  return (
    <MainLayout rightSidebar={<HomeRightSidebar />}>
      {loading ? (
        <p className="text-muted dark:text-dark-muted">Loading posts...</p>
      ) : (
        <>
          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setShowSortDropdown((prev) => !prev)}
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border-gray-300 dark:border-gray-600 hover:bg-action-hover dark:hover:bg-dark-action-hover transition text-black dark:text-white"
            >
              <AlignLeft size={16} /> Sort by
            </button>

            {showSortDropdown && (
              <div className="absolute mt-2 w-40 bg-white dark:bg-dark-card-bg border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-10 overflow-hidden">
                <button
                  onClick={() => {
                    setSortOption("latest");
                    setShowSortDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-dark-card-hover"
                >
                  Latest
                </button>
                <button
                  onClick={() => {
                    setSortOption("oldest");
                    setShowSortDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-dark-card-hover"
                >
                  Oldest
                </button>
                <button
                  onClick={() => {
                    setSortOption("top");
                    setShowSortDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-dark-card-hover"
                >
                  Top Liked
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-4" />

          <PostList posts={sortedPosts} />
        </>
      )}
    </MainLayout>
  );
}
