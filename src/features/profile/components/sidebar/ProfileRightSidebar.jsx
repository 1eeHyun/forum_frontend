import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "@/api/axios";

import SidebarCardWrapper from "@/components/sidebar/cards/SidebarCardWrapper";
import TopPostCard from "@/components/sidebar/cards/TopPostCard";
import CommunityPreviewCard from "@community/components/common/CommunityPreviewCard";
import ProfileInfoCard from "@profile/components/sidebar/cards/ProfileInfoCard";
import { PROFILE_SIDEBAR_SECTION_TITLES } from "@/constants/labels/sidebarLabels";
import { PROFILE } from "@/constants/apiRoutes/profile";
import RelatedPostCard from "@/components/sidebar/cards/RelatedPostCard";

export default function ProfileRightSidebar({
  profile: initialProfile = null,
  topLikedPosts = [],
  recentPosts = [],
  joinedCommunities = [],
}) {
  const { username } = useParams();
  const [profile, setProfile] = useState(initialProfile);
  const [sidebarData, setSidebarData] = useState({
    topPosts: topLikedPosts,
    latestPosts: recentPosts,
    communities: joinedCommunities,
  });

  // Update local state when props change
  useEffect(() => {
    setSidebarData({
      topPosts: topLikedPosts,
      latestPosts: recentPosts,
      communities: joinedCommunities,
    });
  }, [topLikedPosts, recentPosts, joinedCommunities]);

  // Fallback data fetching if props are empty
  useEffect(() => {
    const noProps =
      topLikedPosts.length === 0 &&
      recentPosts.length === 0 &&
      joinedCommunities.length === 0;

    if (initialProfile || !username || !noProps) return;

    const fetchData = async () => {
      try {
        const [latest, top, joined, profileRes] = await Promise.all([
          axios(PROFILE.GET_LATEST_POSTS(username)),
          axios(PROFILE.GET_TOP_POSTS(username)),
          axios(PROFILE.GET_COMMUNITIES(username)),
          axios(PROFILE.GET(username)),
        ]);

        setSidebarData({
          latestPosts: latest.data.data || [],
          topPosts: top.data.data || [],
          communities: joined.data.data || [],
        });

        setProfile(profileRes.data.data);
      } catch (err) {
        console.error("Failed to load profile sidebar data", err);
      }
    };

    fetchData();
  }, [username, initialProfile]);

  const sections = [
    {
      title: PROFILE_SIDEBAR_SECTION_TITLES.TOP_LIKED_POSTS,
      items: sidebarData.topPosts,
      renderItem: (item) => <TopPostCard key={item.id} post={item} />,
      emptyText: "No top posts.",
    },
    {
      title: PROFILE_SIDEBAR_SECTION_TITLES.RECENT_POSTS,
      items: sidebarData.latestPosts,
      renderItem: (item) => <RelatedPostCard key={item.id} post={item} />,
      emptyText: "No recent posts.",
    },
    {
      title: PROFILE_SIDEBAR_SECTION_TITLES.JOINED_COMMUNITIES,
      items: sidebarData.communities,
      renderItem: (item) => <CommunityPreviewCard key={item.id} community={item} />,
      emptyText: "No joined communities.",
    },
  ];

  return (
    <div className="space-y-6 pl-6 h-full">
      {profile && <ProfileInfoCard profile={profile} />}

      {sections.map(({ title, items, renderItem, emptyText }) => (
        <SidebarCardWrapper key={title} title={title}>
          {items.length > 0 ? (
            <div className="space-y-2">{items.map(renderItem)}</div>
          ) : (
            <p className="text-gray-500 text-sm italic">{emptyText}</p>
          )}
        </SidebarCardWrapper>
      ))}
    </div>
  );
}
