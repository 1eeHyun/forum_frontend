import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/api/axios";
import PostList from "@/features/post/components/list/PostList";
import MainLayout from "@/layout/MainLayout";
import { TAG } from "@/constants/apiRoutes/tags";

export default function TagPage() {
  const { tagName } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await axios.get(`/tags/${tagName}/posts`);
        setPosts(res.data.data.content);
      } catch (err) {
        console.error("Failed to fetch tag posts", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [tagName]);

  return (
    <MainLayout rightSidebar={null}>
      <h1 className="text-xl font-bold mb-4">Posts tagged with #{tagName}</h1>
      {loading ? <p>Loading...</p> : <PostList posts={posts} />}
    </MainLayout>
  );
}
