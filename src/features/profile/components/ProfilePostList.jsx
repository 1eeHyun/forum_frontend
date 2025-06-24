import { useNavigate } from "react-router-dom";
import { Images, Heart, MessageCircle } from "lucide-react";

export default function ProfilePostList({ posts, lastPostRef, isSidebarOpen }) {
  const navigate = useNavigate();

  if (posts.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400 italic">No posts available.</p>;
  }

  return (
    <div
      className={`grid gap-6 transition-all duration-300 ${
        isSidebarOpen ? "grid-cols-1" : "grid-cols-2"
      }`}
    >
      {posts.map((post, idx) => (
        <div
          key={post.id}
          ref={idx === posts.length - 1 ? lastPostRef : null}
          className="relative bg-gray-100 dark:bg-[#2b2f33] min-h-[250px] rounded shadow overflow-hidden cursor-pointer hover:shadow-lg transition group p-4 text-black dark:text-white"
          onClick={() => navigate(`/post/${post.id}`)}
        >
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <div className="flex items-center gap-6 text-white text-sm font-medium">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {post.likeCount ?? 0}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {post.commentCount ?? 0}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-0">
            <h4 className="text-base font-semibold line-clamp-1 break-words mb-4">
              {post.title}
            </h4>

            {post.imageUrls?.length > 0 ? (
              <div className="relative w-full h-[250px] mb-2">
                <img
                  src={post.imageUrls[0]}
                  alt="Post thumbnail"
                  className="object-contain w-full h-full"
                />
                {post.imageUrls.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 p-1 rounded">
                    <Images size={16} className="text-white" />
                  </div>
                )}
              </div>
            ) : (
              <p className="line-clamp-12 text-sm text-gray-700 dark:text-gray-300 break-words mt-2">
                {post.content}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
