import PostCard from "./postcard/PostCard";

export default function PostList({ posts }) {
  if (!posts?.length) {
    return <p className="text-gray-400">No posts found.</p>;
  }

  return (
    <div>
      {posts.map((post, index) => (
        <div key={post.id} className="pb-6">
          <PostCard post={post} />
          {index < posts.length - 1 && (
            <div className="mt-6 border-b border-gray-200 dark:border-gray-700" />
          )}
        </div>
      ))}
    </div>
  );
}
