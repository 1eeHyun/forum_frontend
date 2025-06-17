export default function PostCard({ post }) {
    return (
      <div className="rounded-lg p-4 border border-zinc-700 hover:bg-zinc-700 transition">
        <h2 className="text-lg font-semibold text-white">{post.title}</h2>
        <p className="text-gray-400 text-sm mt-1">{post.content}</p>
      </div>
    );
  }
  