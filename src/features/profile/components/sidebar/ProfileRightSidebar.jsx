import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "@/api/axios";

import SidebarCardWrapper from "@/components/sidebar/cards/SidebarCardWrapper";
import TopPostCard from "@/components/sidebar/cards/TopPostCard";
import CommunityPreviewCard from "@community/components/common/CommunityPreviewCard";
import { PROFILE_SIDEBAR_SECTION_TITLES } from "@/constants/labels/sidebarLabels";

export default function ProfileRightSidebar() {
  const { username } = useParams();

  const [latestPosts, setLatestPosts] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    if (!username) return;

    const fetchData = async () => {
      try {
        const [latest, top, joined] = await Promise.all([
          axios.get(`/profiles/${username}/posts?sort=newest&page=0&size=5`),
          axios.get(`/profiles/${username}/posts?sort=top&page=0&size=5`),
          axios.get(`/profiles/${username}/communities`),
        ]);

        setLatestPosts(latest.data.data || []);
        setTopPosts(top.data.data || []);
        setCommunities(joined.data.data || []);
      } catch (err) {
        console.error("Failed to load profile sidebar data", err);
      }
    };

    fetchData();
  }, [username]);

  return (
    <div className="space-y-6 pl-6 h-full">
      {/* Top liked posts */}
      <SidebarCardWrapper title={PROFILE_SIDEBAR_SECTION_TITLES.TOP_LIKED_POSTS}>
        {topPosts.length > 0 ? (
          topPosts.map((post) => <TopPostCard key={post.id} post={post} />)
        ) : (
          <p className="text-gray-500 text-sm italic">No top posts.</p>
        )}
      </SidebarCardWrapper>

      {/* Recent posts */}
      <SidebarCardWrapper title={PROFILE_SIDEBAR_SECTION_TITLES.RECENT_POSTS}>
        {latestPosts.length > 0 ? (
          latestPosts.map((post) => <TopPostCard key={post.id} post={post} />)
        ) : (
          <p className="text-gray-500 text-sm italic">No recent posts.</p>
        )}
      </SidebarCardWrapper>

      {/* Joined communities */}
      <SidebarCardWrapper title={PROFILE_SIDEBAR_SECTION_TITLES.JOINED_COMMUNITIES}>
        {communities.length > 0 ? (
          <div className="space-y-2">
            {communities.map((community) => (
              <CommunityPreviewCard key={community.id} community={community} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">No joined communities.</p>
        )}
      </SidebarCardWrapper>
    </div>
  );
}
