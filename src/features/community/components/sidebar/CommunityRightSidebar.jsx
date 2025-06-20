import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  getCommunityDetail,
  fetchCommunityOnlineUsers,
  fetchCommunityTopPostsByCategory,
  fetchCommunityNewMembers,
} from "@community/services/communityApi";

import TopPostCard from "@/components/sidebar/cards/TopPostCard";
import CommunityUserCard from "./cards/CommunityUserCard";
import CommunityInfoCard from "./cards/CommunityInfoCard";
import SidebarCardWrapper from "@/components/sidebar/cards/SidebarCardWrapper";
import { COMMUNITY_SIDEBAR_SECTION_TITLES } from "@/constants/labels/sidebarLabels";

export default function CommunityRightSidebar({ communityId }) {
  const [community, setCommunity] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [topPostsByCategory, setTopPostsByCategory] = useState({});
  const [newUsers, setNewUsers] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!communityId) return;

    getCommunityDetail(communityId)
      .then((res) => setCommunity(res.data))
      .catch((err) => console.error("Failed to fetch community detail:", err));

    fetchCommunityOnlineUsers(communityId)
      .then((res) => setOnlineUsers(res.data))
      .catch((err) => console.error("Failed to fetch online users:", err));

    fetchCommunityTopPostsByCategory(communityId)
      .then((res) => setTopPostsByCategory(res.data ?? {}))      
      .catch((err) => console.error("Failed to fetch top posts by category:", err));

    fetchCommunityNewMembers(communityId)
      .then((res) => setNewUsers(res.data ?? []))
      .catch((err) => console.error("Failed to fetch new members:", err));
  }, [communityId]);

  if (!community) return null;

  return (
    <div className="space-y-6 pl-6 h-full">
      <CommunityInfoCard
        name={community.name}
        description={community.description}
        createdAt={community.createdAt}
        memberCount={community.memberCount}
        rules={Array.isArray(community.rules) ? community.rules : []}
        postCount={community.postCount}
      />

      <SidebarCardWrapper title={COMMUNITY_SIDEBAR_SECTION_TITLES.TOP_POSTS_BY_CATEGORY_THIS_WEEK}>
        {Object.entries(topPostsByCategory).map(([categoryName, posts]) => (
          <div key={categoryName}>
            <button
              onClick={() => {
                const searchParams = new URLSearchParams(location.search);
                searchParams.set("category", categoryName);
                navigate({ search: searchParams.toString() });
              }}
              className="text-xs font-semibold text-white bg-blue-600 px-3 py-1 rounded-full hover:bg-blue-700 transition mb-2 ml-2"
            >
              {categoryName}
            </button>

            {Array.isArray(posts) &&
              posts.map((post) => (
                <TopPostCard key={post.id} post={{ ...post, categoryName }} fromCommunity />
              ))}
          </div>
        ))}
      </SidebarCardWrapper>

      {Array.isArray(community.categories) && community.categories.length > 0 && (
        <SidebarCardWrapper title={COMMUNITY_SIDEBAR_SECTION_TITLES.CATEGORIES}>
          <div className="flex flex-wrap gap-2">
            {community.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  const searchParams = new URLSearchParams(location.search);
                  searchParams.set("category", cat.name);
                  navigate({ search: searchParams.toString() });
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 transition"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </SidebarCardWrapper>
      )}

      <SidebarCardWrapper title={COMMUNITY_SIDEBAR_SECTION_TITLES.NEW_MEMBERS_THIS_WEEK}>
        {Array.isArray(newUsers) && newUsers.length > 0 ? (
          newUsers.map((user) => (
            <CommunityUserCard key={user.id} user={user} showStatusDot={false} />
          ))
        ) : (
          <p className="text-gray-500 text-sm">{COMMUNITY_SIDEBAR_SECTION_TITLES.NO_DATA_AVAILABLE}</p>
        )}
      </SidebarCardWrapper>

      <SidebarCardWrapper title={COMMUNITY_SIDEBAR_SECTION_TITLES.USERS_ONLINE}>
        {Array.isArray(onlineUsers) && onlineUsers.length > 0 ? (
          onlineUsers.map((user) => (
            <CommunityUserCard key={user.id} user={user} showRole showStatusDot />
          ))
        ) : (
          <p className="text-gray-500 text-sm">{COMMUNITY_SIDEBAR_SECTION_TITLES.NO_DATA_AVAILABLE}</p>
        )}
      </SidebarCardWrapper>
    </div>
  );
}
