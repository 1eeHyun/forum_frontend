import RelatedPostCard from "./cards/RelatedPostCard";
import TopPostCard from "./cards/TopPostCard";
import SidebarCardWrapper from "./SidebarCardWrapper";

import {
  fetchRecentPostsFromMyCommunities,
  fetchTopPostsThisWeek,
  fetchRecentViewedPosts,
} from "@home/services/sidebarApi";

import axios from "@/api/axios";
import { useEffect, useState } from "react";
import { getViewedPostIds } from "@/utils/recentViews";

export default function HomeRightSidebar() {
  const [topPosts, setTopPosts] = useState([]);
  const [recentCommunityPosts, setRecentCommunityPosts] = useState([]);
  const [recentViewedPosts, setRecentViewedPosts] = useState([]);

  // Recent posts from my communities
  useEffect(() => {
    fetchRecentPostsFromMyCommunities()
      .then((res) => setRecentCommunityPosts(res.data.data))
      .catch((err) => console.error("Failed to fetch recent community posts", err));
  }, []);

  // Weekly top posts
  useEffect(() => {
    fetchTopPostsThisWeek()
      .then((res) => setTopPosts(res.data.data))
      .catch((err) => console.error("Failed to fetch top posts", err));
  }, []);

  // Recently viewed posts
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchRecentViewedPosts()
        .then((res) => setRecentViewedPosts(res.data.data))
        .catch((err) => console.error("Failed to fetch recently viewed posts", err));
    } else {
      const ids = getViewedPostIds();
      if (ids.length > 0) {
        axios
          .get(`/posts/recent?localIds=${ids.join(",")}`)
          .then((res) => setRecentViewedPosts(res.data.data))
          .catch((err) =>
            console.error("Failed to fetch recent posts from localStorage", err)
          );
      }
    }
  }, []);

  return (
    <div className="space-y-5 h-full">
      {recentCommunityPosts?.length > 0 && (
        <SidebarCardWrapper
          title="COMMUNITY RECENT POSTS"
          action={
            <button className="text-primary text-xs hover:underline">
              Clear
            </button>
          }
        >
          {recentCommunityPosts.map((post) => (
            <RelatedPostCard key={post.id} post={post} />
          ))}
        </SidebarCardWrapper>
      )}

      {topPosts.length > 0 && (
        <SidebarCardWrapper title="TOP 5 POSTS THIS WEEK">
          {topPosts.map((post) => (
            <TopPostCard key={post.id} post={post} />
          ))}
        </SidebarCardWrapper>
      )}

      {recentViewedPosts?.length > 0 && (
        <SidebarCardWrapper title="RECENTLY VIEWED">
          {recentViewedPosts.map((post) => (
            <RelatedPostCard key={post.id} post={post} />
          ))}
        </SidebarCardWrapper>
      )}
    </div>
  );
}
