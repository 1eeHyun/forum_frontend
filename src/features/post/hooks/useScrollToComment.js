import { useEffect } from "react";

export const useScrollToComment = (commentId, post, openReplyList) => {
  useEffect(() => {
    if (!commentId || !post?.comments?.length) return;

    const isTopLevel = post.comments.some(c => c.commentId === Number(commentId));
    if (isTopLevel) {
      setTimeout(() => {
        const el = document.getElementById(`comment-${commentId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          el.classList.add("ring-2", "ring-purple-500");
          setTimeout(() => el.classList.remove("ring-2", "ring-purple-500"), 3000);
        }
      }, 100);
      return;
    }

    const parent = post.comments.find(c =>
      c.replies?.some(r => r.commentId === Number(commentId))
    );

    if (parent) {
      openReplyList(parent.commentId);
      setTimeout(() => {
        const el = document.getElementById(`comment-${commentId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          el.classList.add("ring-2", "ring-purple-500");
          setTimeout(() => el.classList.remove("ring-2", "ring-purple-500"), 3000);
        }
      }, 100);
    }
  }, [commentId, post]);
};
