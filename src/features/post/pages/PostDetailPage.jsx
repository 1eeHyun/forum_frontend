import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/api/axios";

import PostHeader from "../components/detail/PostHeader";
import PostContent from "../components/detail/PostContent";
import PostCommentSection from "../components/detail/PostCommentSection";
import CommunityRightSidebar from "@community/components/sidebar/CommunityRightSidebar";
import MainLayout from "@/layout/MainLayout";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        console.log("Fetched post data:", response.data.data);
        setPost(response.data.data); // post: PostDetailDTO
        setError(null);
      } catch (err) {        
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center text-gray-500 dark:text-gray-400 p-8">Loading post...</div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <div className="text-center text-red-500 dark:text-red-400 p-8">{error || "Post not found."}</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 py-8 gap-8">
        {/* Left: Post Content */}
        <div className="flex-1">
          <PostHeader
            title={post.title}
            author={post.author}
            createdAt={post.createdAt}
            community={post.community}
            likeCount={post.likeCount}
            likedByMe={post.likedByMe}
            isAuthor={post.isAuthor}
          />
          <PostContent
            content={post.content}
            imageUrls={post.imageUrls}
            likeUsers={post.likeUsers}
          />
          <PostCommentSection
            comments={post.comments}
            commentCount={post.commentCount}
            postId={post.id}
            isAuthor={post.isAuthor}
          />
        </div>

        {/* Right: Community Sidebar */}
        {post.community?.id && (
          <div className="w-full lg:w-[280px] shrink-0">
            <CommunityRightSidebar community={post.community.id} />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
