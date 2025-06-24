import { useRef, useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProfile, fetchProfilePosts } from "@profile/services/profileApi";
import { ROUTES } from "@/constants/apiRoutes/routes";

import ProfileHeader from "@profile/components/ProfileHeader";
import ProfilePostList from "@profile/components/ProfilePostList";
import MainLayout from "@/layout/MainLayout";
import ProfileRightSidebar from "../components/sidebar/ProfileRightSidebar";

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const observer = useRef();

  const [profile, setProfile] = useState(null);
  const [isMine, setIsMine] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState("newest");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Detect if sidebar is open based on <aside> width
  useEffect(() => {
    const checkSidebar = () => {
      const aside = document.querySelector("aside");
      if (aside) {
        const width = parseInt(aside.style.width || "0", 10);
        setIsSidebarOpen(width > 100);
      }
    };

    const interval = setInterval(checkSidebar, 300);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!token) navigate(ROUTES.LOGIN);
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;

    fetchProfile(username)
      .then((res) => {
        const {
          nickname,
          bio,
          imageDTO,
          isMe,
          totalPostCount,
          followers,
          followings,
        } = res.data.data;

        setProfile({
          nickname,
          bio,
          imageDTO,
          followers,
          followings,
          postCount: totalPostCount,
        });

        setPostCount(totalPostCount);
        setIsMine(Boolean(isMe));
      })
      .catch((err) => console.error("Failed to fetch profile:", err));
  }, [username, token]);

  useEffect(() => {
    if (!token || !profile) return;

    const loadInitialPosts = async () => {
      try {
        const res = await fetchProfilePosts(username, sortOption, 0, 10);
        setPosts(res.data.data);
        setHasMore(res.data.data.length === 10);
        setPage(1);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };

    loadInitialPosts();
  }, [profile, sortOption]);

  const lastPostRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, page, sortOption]
  );

  const loadMore = async () => {
    try {
      const res = await fetchProfilePosts(username, sortOption, page, 10);
      const postList = res.data.data;

      setPosts((prev) => [...prev, ...postList]);
      setHasMore(postList.length === 10);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to load more posts:", err);
    }
  };

  useEffect(() => {
    if (selectedPostId) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => document.body.classList.remove("overflow-hidden");
  }, [selectedPostId]);

  if (!token) return null;
  if (!profile || isMine === null)
    return <div className="p-6 text-gray-400">Loading profile...</div>;

  return (
    <MainLayout rightSidebar={<ProfileRightSidebar />}>
      <div className="max-w-4xl p-2 text-black dark:text-white transition-colors duration-300">
        <ProfileHeader
          profile={profile}
          username={username}
          isMine={isMine}
          posts={posts}
          setProfile={setProfile}
        />
  
        <h3 className="text-xxl text-center font-semibold mt-auto mb-3">POSTS</h3>
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
