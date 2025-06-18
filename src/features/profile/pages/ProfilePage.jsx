import { useRef, useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProfile, fetchProfilePosts } from "@profile/services/profileApi";
import { ROUTES } from "@/constants/api/routes";

import ProfileHeader from "@profile/components/ProfileHeader";
import ProfilePostList from "@profile/components/ProfilePostList";
import PostDetailModal from "@post/components/detail/post/modal/PostDetailModal";

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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) navigate(ROUTES.LOGIN);
  }, [token, navigate]);

  // Fetch profile data on mount or when username changes
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

        // Store profile data and ownership status
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

  // Load initial posts after profile is fetched
  useEffect(() => {
    if (!token || !profile) return;

    const loadInitialPosts = async () => {
      try {
        const res = await fetchProfilePosts(username, sortOption, 0, 10);
        setPosts(res.data.data);
        setHasMore(res.data.data.length === 10); // Check if there are more posts to load
        setPage(1);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };

    loadInitialPosts();
  }, [profile, sortOption]);

  // Intersection observer for infinite scroll
  const lastPostRef = useCallback(
    (node) => {
      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [hasMore, page, sortOption]
  );

  // Load more posts when reaching bottom
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


  // Disable scroll when modal is open
  useEffect(() => {
    if (selectedPostId) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [selectedPostId]);

  // Render loading state
  if (!token) return null;
  if (!profile || isMine === null)
    return <div className="p-6 text-gray-400">Loading profile...</div>;

  // Render profile page
  return (
    <div className="max-w-4xl p-10">
      <ProfileHeader
        profile={profile}
        username={username}
        isMine={isMine}
        posts={posts}
        setProfile={setProfile}
      />

      <h3 className="text-xxl text-center font-semibold mt-auto mb-3">POSTS</h3>
      <div className="w-full h-px bg-white/10 mb-4" />

      <ProfilePostList
        posts={posts}
        onPostClick={setSelectedPostId}
        lastPostRef={lastPostRef}
      />

      {selectedPostId && (
        <PostDetailModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </div>
  );
}
