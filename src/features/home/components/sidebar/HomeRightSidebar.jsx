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

  const removeDuplicates = (posts) =>
    posts.filter(
      (post, index, self) =>
        index === self.findIndex((p) => p.id === post.id)
    );

  // Recent community post
  useEffect(() => {
    fetchRecentPostsFromMyCommunities()
      .then((res) => setRecentCommunityPosts(removeDuplicates(res.data.data)))
      .catch((err) =>
        console.error(ERROR_MESSAGES.FETCH_RECENT_COMMUNITY, err)
      );
  }, []);

  // Top post
  useEffect(() => {
    fetchTopPostsThisWeek()
      .then((res) => setTopPosts(removeDuplicates(res.data.data)))
      .catch((err) => console.error(ERROR_MESSAGES.FETCH_TOP_WEEKLY, err));
  }, []);

  // Recently viewed post
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (token) {
      fetchRecentViewedPosts()
        .then((res) => {
          const unique = removeDuplicates(res.data.data);
          setRecentViewedPosts(unique);
        })
        .catch((err) =>
          console.error(ERROR_MESSAGES.FETCH_RECENT_VIEWED, err)
        );
    } else {
      const ids = getViewedPostIds();
      if (ids.length > 0) {
        axios
          .get(`${POSTS.RECENTLY_VIEWED.url}?localIds=${ids.join(",")}`)
          .then((res) => {
            const unique = removeDuplicates(res.data.data);
            setRecentViewedPosts(unique);
          })
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
            <RelatedPostCard key={`community-${post.id}`} post={post} />
          ))}
        </SidebarCardWrapper>
      )}

      {topPosts.length > 0 && (
        <SidebarCardWrapper title={HOME_SIDEBAR_SECTION_TITLES.TOP_POSTS_THIS_WEEK}>
          {topPosts.map((post) => (
            <TopPostCard key={`top-${post.id}`} post={post} />
          ))}
        </SidebarCardWrapper>
      )}

      {recentViewedPosts?.length > 0 && (
        <SidebarCardWrapper title={HOME_SIDEBAR_SECTION_TITLES.RECENTLY_VIEWED}>
          {recentViewedPosts.map((post) => (
            <RelatedPostCard key={`viewed-${post.id}`} post={post} />
          ))}
        </SidebarCardWrapper>
      )}
    </div>
  );
}
