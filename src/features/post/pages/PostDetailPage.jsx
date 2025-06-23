import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/api/axios";
import { POST_ROUTES, AUTH_ROUTES } from "@/constants/apiRoutes";

import PostContent from "@post/components/detail/post/content/PostContent";
import PostCommentSection from "@post/components/detail/comment/PostCommentSection";
import CommunityRightSidebar from "@community/components/sidebar/CommunityRightSidebar";
import PostStat from "@post/components/detail/post/stat/PostStat";
import PostHeader from "@post/components/detail/post/header/PostHeader";
import MainLayout from "@/layout/MainLayout";

export default function PostDetailPage() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    fetchUser();
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
        <div className="text-center text-red-500 dark:text-red-400 p-8">
          {error || "Post not found."}
        </div>
      </MainLayout>
    );
  }

  const handleCommentClick = () => {
    document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 py-8 gap-8">
        {/* Left: Post content */}
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

          <PostStat
            postId={post.id}
            initialLikeCount={post.likeCount}
            commentCount={post.commentCount}
            user={user} // used to determine like/dislike access
            onCommentClick={handleCommentClick}
            onShare={() => navigator.clipboard.writeText(window.location.href)}
          />

          <PostCommentSection
            comments={post.comments}
            commentCount={post.commentCount}
            postId={post.id}
            isAuthor={post.isAuthor}
            user={user}
          />
        </div>

        {/* Right: Community sidebar */}
        {post.community?.id && (
          <div className="w-full lg:w-[400px] shrink-0">
            <CommunityRightSidebar communityId={post.community.id} />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
