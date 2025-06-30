import { useNavigate } from "react-router-dom";
import PostHeader from "./PostHeader";
import PostImageSlider from "./PostImageSlider";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import { ROUTES } from "@/constants/apiRoutes/routes"

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const hasImages = post.imageUrls && post.imageUrls.length > 0;

  const handleCardClick = () => {
    navigate(ROUTES.POST_DETAIL(post.id));
    // navigate(`/post/${post.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="
        mb-4 w-full cursor-pointer rounded-xl border border-card
        hover:border-card-hover hover:bg-card-bg hover:scale-[1.01]
        transition duration-200 overflow-hidden
        bg-white dark:bg-[#1a1d21]
      "
    >
      <PostHeader post={post} />

      <div className="px-4 mt-2">
        <h3 className="text-lg font-semibold text-black dark:text-white line-clamp-2 break-words">
          {post.title}
        </h3>
      </div>

      {hasImages ? (
        <PostImageSlider images={post.imageUrls} />
      ) : (
        <PostContent content={post.content} />
      )}

      <PostActions post={post} />
    </div>
  );
}
