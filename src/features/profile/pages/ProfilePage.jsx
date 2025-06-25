import { useRef, useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProfile, fetchProfilePosts } from "@/features/profile/services/profileApi";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { PROFILE_PAGE } from "@/constants/profile/pageConstants";
import { PROFILE } from "@/constants/apiRoutes/profile";
import axios from "@/api/axios";

import ProfileHeader from "@/features/profile/components/ProfileHeader";
import ProfilePostList from "@/features/profile/components/ProfilePostList";
import MainLayout from "@/layout/MainLayout";
import ProfileRightSidebar from "@/features/profile/components/sidebar/ProfileRightSidebar";

const SIDEBAR_WIDTH_THRESHOLD = 100;
const SIDEBAR_CHECK_INTERVAL = 300;
const DEFAULT_WIDTH_STRING = "0";
const BODY_SCROLL_LOCK_CLASS = "overflow-hidden";

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const observer = useRef(null);

  const [profile, setProfile] = useState(null);
  const [isMine, setIsMine] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState(PROFILE_PAGE.DEFAULT_SORT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarData, setSidebarData] = useState({
    topPosts: [],
    latestPosts: [],
    communities: [],
  });

  useEffect(() => {
    if (!token) navigate(ROUTES.LOGIN);
  }, [token, navigate]);

  useEffect(() => {
    const checkSidebar = () => {
      const aside = document.querySelector("aside");
      if (aside) {
        const width = parseInt(aside.style.width || DEFAULT_WIDTH_STRING, 10);
        setIsSidebarOpen(width > SIDEBAR_WIDTH_THRESHOLD);
      }
    };

    const intervalId = setInterval(checkSidebar, SIDEBAR_CHECK_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!token) return;

    fetchProfile(username)
      .then((res) => {
        const {
          username,
          nickname,
          bio,
          imageDTO,
          isMe,
          totalPostCount,
          followers,
          followings,
        } = res.data.data;

        setProfile({
          username,
          nickname,
          bio,
          imageDTO,
          followers,
          followings,
          totalPostCount,
        });
        setPostCount(totalPostCount);
        setIsMine(Boolean(isMe));
      })
      .catch((err) => console.error("Failed to fetch profile:", err));
  }, [username, token]);

  useEffect(() => {
    if (!profile) return;

    const fetchSidebarData = async () => {
      try {
        const [latest, top, joined] = await Promise.all([
          axios(PROFILE.GET_LATEST_POSTS(username)),
          axios(PROFILE.GET_TOP_POSTS(username)),
          axios(PROFILE.GET_COMMUNITIES(username)),
        ]);

        setSidebarData({
          latestPosts: latest.data.data || [],
          topPosts: top.data.data || [],
          communities: joined.data.data || [],
        });
      } catch (err) {
        console.error("Failed to load sidebar data", err);
      }
    };

    fetchSidebarData();
  }, [profile, username]);

  useEffect(() => {
    if (!token || !profile) return;

    const loadInitialPosts = async () => {
      try {
        const res = await fetchProfilePosts(
          username,
          sortOption,
          0,
          PROFILE_PAGE.PAGE_SIZE
        );
        setPosts(res.data.data);
        setHasMore(res.data.data.length === PROFILE_PAGE.PAGE_SIZE);
        setPage(1);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };

    loadInitialPosts();
  }, [profile, sortOption, token, username]);

  const loadMore = useCallback(async () => {
    try {
      const res = await fetchProfilePosts(
        username,
        sortOption,
        page,
        PROFILE_PAGE.PAGE_SIZE
      );
      const newPosts = res.data.data;

      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(newPosts.length === PROFILE_PAGE.PAGE_SIZE);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to load more posts:", err);
    }
  }, [username, sortOption, page]);

  const lastPostRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, loadMore]
  );

  useEffect(() => {
    document.body.classList.toggle(BODY_SCROLL_LOCK_CLASS, Boolean(selectedPostId));
    return () => document.body.classList.remove(BODY_SCROLL_LOCK_CLASS);
  }, [selectedPostId]);

  if (!token) return null;
  if (!profile || isMine === null) {
    return <div className="p-6 text-gray-400">{PROFILE_PAGE.LOADING_MESSAGE}</div>;
  }

  return (
    <MainLayout
      rightSidebar={
        <ProfileRightSidebar
          profile={profile}
          topLikedPosts={sidebarData.topPosts}
          recentPosts={sidebarData.latestPosts}
          joinedCommunities={sidebarData.communities}
        />
      }
    >
      <div className="max-w-4xl p-2 text-black dark:text-white transition-colors duration-300">
        <ProfileHeader
          profile={profile}
          username={username}
          isMine={isMine}
          posts={posts}
          setProfile={setProfile}
        />

        <h3 className="text-xxl text-center font-semibold mt-auto mb-3">
          {PROFILE_PAGE.SECTION_TITLES.POSTS}
        </h3>
        <div className="w-full h-px bg-gray-300 dark:bg-white/10 mb-4" />

        <ProfilePostList
          posts={posts}
          onPostClick={setSelectedPostId}
          lastPostRef={lastPostRef}
          isSidebarOpen={isSidebarOpen}
        />
      </div>
    </MainLayout>
  );
}
