import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/api/axios";

import PostContent from "@post/components/detail/post/content/PostContent";
import PostCommentSection from "@post/components/detail/comment/PostCommentSection";
import CommunityRightSidebar from "@community/components/sidebar/CommunityRightSidebar";
import PostStat from "@post/components/detail/post/stat/PostStat";
import PostHeader from "@post/components/detail/post/header/PostHeader";
import MainLayout from "@/layout/MainLayout";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        setPost(response.data.data);
        setError(null);
      } catch (err) {
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await axios.get("/auth/me");
        setUser(res.data.data);
      } catch (err) {
        setUser(null);
      }
    };

    fetchPost();
    fetchUser();
  }, [id]);

  if (loading || user === undefined) {
    return (
      <MainLayout>
        <div className="text-center text-gray-500 dark:text-gray-400 p-8">Loading post...</div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <div className="text-center text-red-500 dark:text-red-400 p-8">
          {error || "Post not found."}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 py-8 gap-8">
        {/* ======= Left Section: Post ======= */}
        <div className="flex-1">
          <PostHeader
            title={post.title}
            author={post.author}
            createdAt={post.createdAt}
            community={post.community}
          />
          <PostContent
            content={post.content}
            imageUrls={post.imageUrls}
            likeUsers={post.likeUsers}
          />
          <PostStat likeCount={post.likeCount} commentCount={post.commentCount} />
          <PostCommentSection
            comments={post.comments}
            commentCount={post.commentCount}
            postId={post.id}
            isAuthor={post.isAuthor}
            user={user}
          />
        </div>

        {/* ======= Right Section: Community Sidebar ======= */}
        {post.community?.id && (
          <div className="w-full lg:w-[400px] shrink-0">
            <CommunityRightSidebar communityId={post.community.id} />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
