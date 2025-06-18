import RelatedPostCard from "@/components/sidebar/cards/RelatedPostCard";
import TopPostCard from "@/components/sidebar/cards/TopPostCard";
import SidebarCardWrapper from "@/components/sidebar/cards/SidebarCardWrapper";

import {
  fetchRecentPostsFromMyCommunities,
  fetchTopPostsThisWeek,
  fetchRecentViewedPosts,
} from "@home/services/sidebarApi";

import axios from "@/api/axios";
import { useEffect, useState } from "react";
import { getViewedPostIds } from "@/utils/recentViews";
import { POSTS } from "@/constants/apiRoutes/posts";
import { HOME_SIDEBAR_SECTION_TITLES, BUTTON_LABELS } from "@/constants/labels/sidebarLabels";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

export default function HomeRightSidebar() {
  const [topPosts, setTopPosts] = useState([]);
  const [recentCommunityPosts, setRecentCommunityPosts] = useState([]);
  const [recentViewedPosts, setRecentViewedPosts] = useState([]);

  // Recent posts from my communities
  useEffect(() => {
    fetchRecentPostsFromMyCommunities()
      .then((res) => setRecentCommunityPosts(res.data.data))
      .catch((err) =>
        console.error(ERROR_MESSAGES.FETCH_RECENT_COMMUNITY, err)
      );
  }, []);

  // Weekly top posts
  useEffect(() => {
    fetchTopPostsThisWeek()
      .then((res) => setTopPosts(res.data.data))
      .catch((err) => console.error(ERROR_MESSAGES.FETCH_TOP_WEEKLY, err));
  }, []);

  // Recently viewed posts (with token or localStorage)
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (token) {
      fetchRecentViewedPosts()
        .then((res) => setRecentViewedPosts(res.data.data))
        .catch((err) =>
          console.error(ERROR_MESSAGES.FETCH_RECENT_VIEWED, err)
        );
    } else {
      const ids = getViewedPostIds();
      if (ids.length > 0) {
        axios
          .get(`${POSTS.RECENTLY_VIEWED.url}?localIds=${ids.join(",")}`)
          .then((res) => setRecentViewedPosts(res.data.data))
          .catch((err) =>
            console.error(ERROR_MESSAGES.FETCH_RECENT_LOCAL, err)
          );
      }
    }
  }, []);

  return (
    <div className="space-y-5 h-full">
      {recentCommunityPosts?.length > 0 && (
        <SidebarCardWrapper
          title={HOME_SIDEBAR_SECTION_TITLES.COMMUNITY_RECENT_POSTS}
          action={
            <button className="text-primary text-xs hover:underline">
              {BUTTON_LABELS.CLEAR}
            </button>
          }
        >
          {recentCommunityPosts.map((post) => (
            <RelatedPostCard key={post.id} post={post} />
          ))}
        </SidebarCardWrapper>
      )}

      {topPosts.length > 0 && (
        <SidebarCardWrapper title={HOME_SIDEBAR_SECTION_TITLES.TOP_POSTS_THIS_WEEK}>
          {topPosts.map((post) => (
            <TopPostCard key={post.id} post={post} />
          ))}
        </SidebarCardWrapper>
      )}

      {recentViewedPosts?.length > 0 && (
        <SidebarCardWrapper title={HOME_SIDEBAR_SECTION_TITLES.RECENTLY_VIEWED}>
          {recentViewedPosts.map((post) => (
            <RelatedPostCard key={post.id} post={post} />
          ))}
        </SidebarCardWrapper>
      )}
    </div>
  );
}
