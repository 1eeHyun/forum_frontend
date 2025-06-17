import PostHeader from "./PostHeader";
import PostImageSlider from "./PostImageSlider";
import PostContent from "./PostContent";
import PostActions from "./PostActions";

export default function PostCard({ post, onClick }) {
  const hasImages = post.imageUrls && post.imageUrls.length > 0;

  return (
    <div
      onClick={onClick}
      className="
        mb-4 w-full cursor-pointer rounded-xl border border-card
        hover:border-card-hover hover:bg-card-bg hover:scale-[1.01]
        transition duration-200 overflow-hidden
        bg-white dark:bg-[#1a1d21]
      "
    >
      {/* Header */}
      <PostHeader post={post} />

      {/* Title */}
      <div className="px-4 mt-2">
        <h3 className="text-lg font-semibold text-black dark:text-white line-clamp-2 break-words">
          {post.title}
        </h3>
      </div>

      {/* Image or Content */}
      {hasImages ? (
        <PostImageSlider images={post.imageUrls} />
      ) : (
        <PostContent content={post.content} />
      )}

      {/* Button section */}
      <PostActions post={post} />
    </div>
  );
}
