import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/apiRoutes/routes";

import { getPostDetail, updatePost, getCategoriesByCommunityId } from "@post/services/postApi";
import PostForm from "@post/components/form/PostForm";

export default function EditPostPage() {
  const { id: postId } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getPostDetail(postId);
        const post = res.data.data;

        const categoriesRes = await getCategoriesByCommunityId(post.community.id);

        setInitialData({
          title: post.title,
          content: post.content,
          visibility: post.visibility,
          communityId: post.community.id,
          categoryId: post.category?.id,
          files: post.fileUrls,
          community: post.community,
          categories: categoriesRes.data.data,
        });        
      } catch (error) {
        console.error("Failed to load post data:", error);        
      }
    })();
  }, [postId]);

  const handleEdit = async (formData) => {
    try {
      await updatePost(postId, formData);
      navigate(ROUTES.POST_DETAIL(postId));
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  if (!initialData) return <p>Loading...</p>;

  return <PostForm mode="edit" initialData={initialData} onSubmit={handleEdit} />;
}
