import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "@/api/axios";
import {
  POST_ROUTES,
  AUTH_ROUTES,
  PROFILE,
  ROUTES,
} from "@/constants/apiRoutes";

import PostContent from "@post/components/detail/post/content/PostContent";
import PostCommentSection from "@post/components/detail/comment/PostCommentSection";
import CommunityRightSidebar from "@community/components/sidebar/CommunityRightSidebar";
import ProfileRightSidebar from "@profile/components/sidebar/ProfileRightSidebar";
import PostStat from "@post/components/detail/post/stat/PostStat";
import PostHeader from "@post/components/detail/post/header/PostHeader";
import MainLayout from "@/layout/MainLayout";
import PostHiddenCard from "@post/components/list/postcard/PostHiddenCard";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [post, setPost] = useState(null);
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sidebarProfile, setSidebarProfile] = useState(null);
  const [topPosts, setTopPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);

  // Fetch post data + user data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios({
          method: POST_ROUTES.DETAIL(id).method,
          url: POST_ROUTES.DETAIL(id).url,
        });
        setPost(res.data.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await axios({
          method: AUTH_ROUTES.ME.method,
          url: AUTH_ROUTES.ME.url,
        });
        setUser(res.data.data);
      } catch {
        setUser(null); // not logged in
      }
    };

    fetchPost();

    // 🔒 로그인한 경우에만 /auth/me 호출
    if (isLoggedIn) {
      fetchUser();
    } else {
      setUser(null);
    }
  }, [id, isLoggedIn]);

  // Fetch profile sidebar if not in community
  useEffect(() => {
    const fetchSidebarData = async () => {
      if (!post?.community && post?.author?.username) {
        const username = post.author.username;

        try {
          const profileRes = await axios(PROFILE.GET(username));
          const topPostsRes = await axios(PROFILE.GET_TOP_POSTS(username));
          const recentPostsRes = await axios(PROFILE.GET_LATEST_POSTS(username));
          const communitiesRes = await axios(PROFILE.GET_COMMUNITIES(username));

          setSidebarProfile(profileRes.data.data);
          setTopPosts(topPostsRes.data.data);
          setRecentPosts(recentPostsRes.data.data);
          setJoinedCommunities(communitiesRes.data.data);
        } catch (err) {
          console.error("Failed to fetch profile sidebar data:", err);
        }
      }
    };

    fetchSidebarData();
  }, [post?.author?.username]);

  // Delete
  const handleDelete = async () => {
    try {
      await axios({
        method: POST_ROUTES.DELETE(id).method,
        url: POST_ROUTES.DELETE(id).url,
      });

      if (post.community?.id) {
        navigate(ROUTES.COMMUNITY(post.community.id));
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Failed to delete the post:", err);
      alert("Failed to delete the post. Please try again.");
    }
  };

  // Hide
  const handleHide = async () => {
    try {
      await axios({
        method: POST_ROUTES.HIDE(post.id).method,
        url: POST_ROUTES.HIDE(post.id).url,
      });
      setPost({ ...post, isHidden: true });
    } catch (err) {
      console.error("Failed to hide the post:", err);
    }
  };

  // Undo hide
  const handleUndoHide = async () => {
    try {
      await axios({
        method: POST_ROUTES.HIDE(post.id).method,
        url: POST_ROUTES.HIDE(post.id).url,
      });
      setPost({ ...post, isHidden: false });
    } catch (err) {
      console.error("Undo hide failed:", err);
    }
  };

  // Right sidebar logic
  const rightSidebar = post?.community?.id ? (
    <CommunityRightSidebar communityId={post.community.id} />
  ) : sidebarProfile ? (
    <ProfileRightSidebar
      profile={sidebarProfile}
      topLikedPosts={topPosts}
      recentPosts={recentPosts}
      joinedCommunities={joinedCommunities}
    />
  ) : null;

  if (loading || !post) {
    return (
      <MainLayout>
        <div className="text-center text-gray-500 dark:text-gray-400 p-8">
          Loading post...
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center text-red-500 dark:text-red-400 p-8">
          {error}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout rightSidebar={rightSidebar}>
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 py-8 gap-8">
        <div className="flex-1">
          {post.isHidden ? (
            <PostHiddenCard onUndo={handleUndoHide} />
          ) : (
            <>
              <PostHeader
                title={post.title}
                author={post.author}
                createdAt={post.createdAt}
                community={post.community}
                postId={post.id}
                onDelete={handleDelete}
                onHide={handleHide}
                tags={post.tags}
              />

              <PostContent
                content={post.content}
                files={post.fileUrls}
                likeUsers={post.likeUsers}
              />

              <PostStat
                postId={post.id}
                initialLikeCount={post.likeCount}
                commentCount={post.commentCount}
                user={user}
                onCommentClick={() =>
                  document
                    .getElementById("comments")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                onShare={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
              />

              <PostCommentSection
                comments={post.comments}
                commentCount={post.commentCount}
                postId={post.id}
                isAuthor={post.isAuthor}
                user={user}
              />
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
