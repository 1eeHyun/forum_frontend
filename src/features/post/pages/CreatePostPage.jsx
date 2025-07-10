import { useNavigate } from "react-router-dom";
import { createPost } from "@post/services/postApi";
import { ROUTES } from "@/constants/apiRoutes/routes";

export default function CreatePostPage() {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    const res = await createPost(formData);
    const postId = res.data.data.id; 
    navigate(ROUTES.POST_DETAIL(postId));
  };

  return <PostForm mode="create" onSubmit={handleCreate} />;
}
