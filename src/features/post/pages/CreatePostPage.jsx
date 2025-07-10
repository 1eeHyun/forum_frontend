import { useNavigate } from "react-router-dom";
import PostForm from "@post/components/form/PostForm";

export default function CreatePostPage() {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    const res = await createPost(formData);
    navigate(ROUTES.POST_DETAIL(postId));
  };

  return <PostForm mode="create" onSubmit={handleCreate} />;
}
