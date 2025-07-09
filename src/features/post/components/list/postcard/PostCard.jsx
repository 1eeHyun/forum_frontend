import { useNavigate } from "react-router-dom";
import PostHeader from "./PostHeader";
import PostMediaSlider from "./PostMediaSlider";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import { ROUTES } from "@/constants/apiRoutes/routes";

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const hasFiles = post.fileUrls && post.fileUrls.length > 0;

  {hasFiles ? (
    <PostMediaSlider files={post.fileUrls} />
  ) : (
    <PostContent content={post.content} />
  )}

  const handleCardClick = () => {
    navigate(ROUTES.POST_DETAIL(post.id));
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

      {hasFiles ? (
        <PostMediaSlider files={post.fileUrls} />
      ) : (
        <PostContent content={post.content} />
      )}

      <PostActions post={post} />
    </div>
  );
}
