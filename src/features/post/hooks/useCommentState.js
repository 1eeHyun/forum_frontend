import { useState, useMemo } from "react";

export default function useCommentState(comments) {
  const [sortOption, setSortOption] = useState("newest");
  const [replyInputOpenId, setReplyInputOpenId] = useState(null);
  const [openReplyListIds, setOpenReplyListIds] = useState(new Set());

  const toggleReplyInput = (commentId) => {
    setReplyInputOpenId(prev => (prev === commentId ? null : commentId));
  };

  const toggleReplyList = (commentId) => {
    setOpenReplyListIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) newSet.delete(commentId);
      else newSet.add(commentId);
      return newSet;
    });
  };

  const sortedComments = useMemo(() => {
    if (!comments) return [];
    const copied = [...comments];
    return sortOption === "top"
      ? copied.sort((a, b) => b.likeCount - a.likeCount)
      : copied.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [comments, sortOption]);

  return {
    sortOption,
    setSortOption,
    replyInputOpenId,
    toggleReplyInput,
    openReplyListIds,
    toggleReplyList,
    sortedComments,
  };
}
