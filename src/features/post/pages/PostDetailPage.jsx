import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostDetail } from "../services/postApi";
import PostDetailContent from "../components/detail/PostDetailContent";
import MainLayout from "@/layout/MainLayout";
import CommunitySidebar from "@/components/sidebar/CommunitySidebar";

export default function PostDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPostDetail(postId)
      .then((res) => {
        setPost(res.data.data);
      })
      .catch((err) => {
        console.error("Failed to load post", err);
      })
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading) return <MainLayout><div className="p-6 text-gray-400">Loading...</div></MainLayout>;
  if (!post) return <MainLayout><div className="p-6 text-red-400">Post not found.</div></MainLayout>;

  return (
    <MainLayout rightSidebar={<CommunitySidebar communityId={post.communityId} />}>
      <PostDetailContent post={post} />
    </MainLayout>
  );
}
