import PostCard from "./PostCard";

export default function PostList({ posts }) {
  if (!posts?.length) {
    return <p className="text-gray-400">No posts found.</p>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
