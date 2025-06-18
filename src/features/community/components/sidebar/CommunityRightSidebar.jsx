import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TopPostCard from "@/components/sidebar/cards/TopPostCard";
import CommunityUserCard from "./cards/CommunityUserCard";
import CommunityInfoCard from "./cards/CommunityInfoCard";
import SidebarCardWrapper from "@/components/sidebar/cards/SidebarCardWrapper";

import {
  fetchCommunityOnlineUsers,
  fetchCommunityTopPostsByCategory,
  fetchCommunityNewMembers,
} from "@community/services/sidebarApi";

import { COMMUNITY_SIDEBAR_SECTION_TITLES } from "@/constants/labels/sidebarLabels";  // Import titles

export default function CommunityRightSidebar({
  communityId,
  name,
  description,
  createdAt,
  memberCount,
  postCount,
  categories = [],
  rules = [],
}) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [topPostsByCategory, setTopPostsByCategory] = useState({});
  const [newUsers, setNewUsers] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchCommunityOnlineUsers(communityId)
      .then((res) => setOnlineUsers(res.data.data))
      .catch((err) => console.error("Failed to fetch online users:", err));

    fetchCommunityTopPostsByCategory(communityId)
      .then((res) => {
        const data = res?.data?.data ?? {};
        setTopPostsByCategory(data);
      })
      .catch((err) => console.error("Failed to fetch top posts by category:", err));

    fetchCommunityNewMembers(communityId)
      .then((res) => setNewUsers(res.data.data ?? []))
      .catch((err) => console.error("Failed to fetch new members:", err));
  }, [communityId]);

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
  };

  return (
    <div className="space-y-6 pl-6 h-full">
      <CommunityInfoCard
        name={name}
        description={description}
        createdAt={createdAt}
        memberCount={memberCount}
        rules={rules}
        postCount={postCount}
      />

      <SidebarCardWrapper title={COMMUNITY_SIDEBAR_SECTION_TITLES.TOP_POSTS_BY_CATEGORY_THIS_WEEK}>
        {Object.keys(topPostsByCategory).length > 0 &&
          Object.entries(topPostsByCategory).map(([categoryName, posts]) => (
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

              {posts.map((post) => (
                <TopPostCard key={post.id} post={{ ...post, categoryName }} fromCommunity />
              ))}
            </div>
          ))}
      </SidebarCardWrapper>

      <SidebarCardWrapper title={COMMUNITY_SIDEBAR_SECTION_TITLES.NEW_MEMBERS_THIS_WEEK}>
        {newUsers.length > 0 ? (
          newUsers.map((user) => (
            <CommunityUserCard key={user.id} user={user} showStatusDot={false} />
          ))
        ) : (
          <p className="text-gray-500 text-sm">{COMMUNITY_SIDEBAR_SECTION_TITLES.NO_DATA_AVAILABLE}</p>
        )}
      </SidebarCardWrapper>

      <SidebarCardWrapper title={COMMUNITY_SIDEBAR_SECTION_TITLES.USERS_ONLINE}>
        {onlineUsers.length > 0 ? (
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
