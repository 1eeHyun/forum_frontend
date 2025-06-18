import PostCard from "@post/components/PostCard";

export default function ProfilePostList({ posts, onPostClick, lastPostRef }) {
  return (
    <div className="space-y-6">
      {posts.map((post, idx) => (
        <div key={post.id} ref={idx === posts.length - 1 ? lastPostRef : null}>
          <PostCard post={post} onClick={() => onPostClick(post.id)} />
        </div>
      ))}
    </div>
  );
}
