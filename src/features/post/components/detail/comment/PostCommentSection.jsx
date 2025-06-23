import { useMemo, useState } from "react";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";

export default function PostCommentSection({ comments: initialComments = [], postId, user }) {

  const getTotalCommentCount = (comments) => {
    let count = 0;
  
    const traverse = (list) => {
      for (const comment of list) {
        count += 1;
        if (comment.replies?.length > 0) {
          traverse(comment.replies);
        }
      }
    };
  
    traverse(comments);
    return count;
  };

  
  const [comments, setComments] = useState(() =>
    initialComments.map((c) => ({ ...c, replies: c.replies ?? [] }))
  );
  const [replyInputOpenId, setReplyInputOpenId] = useState(null);
  const [openReplyListIds, setOpenReplyListIds] = useState(new Set());

  const toggleReplyInput = (commentId) => {
    setReplyInputOpenId((prev) => (prev === commentId ? null : commentId));
  };

  const toggleReplyList = (commentId) => {
    setOpenReplyListIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(commentId)) {
        updated.delete(commentId);
      } else {
        updated.add(commentId);
      }
      return updated;
    });
  };

  const handleCommentAdded = (newComment) => {
    if (!newComment || !newComment.commentId) return;
  
    setComments((prev) => {
      const updated = structuredClone(prev);
  
      const insertReply = (list) => {
        for (const comment of list) {
          if (comment.commentId === newComment.parentCommentId) {
            comment.replies = comment.replies || [];
            comment.replies.push({ ...newComment, replies: [] });
            return true;
          }
          if (comment.replies && insertReply(comment.replies)) return true;
        }
        return false;
      };
  
      if (newComment.parentCommentId) {
        insertReply(updated);
      } else {
        updated.push({ ...newComment, replies: [] });
      }
  
      return updated;
    });
      
    if (newComment.parentCommentId) {
      setOpenReplyListIds((prev) => {
        const updated = new Set(prev);
        updated.add(newComment.parentCommentId);
        return updated;
      });
    }
  
    setReplyInputOpenId(null);
  };  

  const rootComments = comments.filter((c) => !c.parentCommentId);

  const commentMap = useMemo(() => {
    const map = new Map();
    const traverse = (list) => {
      list.forEach((c) => {
        map.set(c.commentId, c);
        if (c.replies?.length) traverse(c.replies);
      });
    };
    traverse(comments);
    return map;
  }, [comments]);

  return (
    <section className="mt-4 border-t pt-6 border-gray-300 dark:border-gray-700">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-black dark:text-white">
          {getTotalCommentCount(comments)} Comments
        </h2>
      </div>

      <CommentInput postId={postId} onCommentAdded={handleCommentAdded} user={user} />

      <div className="space-y-6 mt-12">
        {rootComments.map((comment) => (
          <CommentItem
            key={comment.commentId}
            commentId={comment.commentId}
            commentMap={commentMap}
            postId={postId}
            user={user}
            replyInputOpenId={replyInputOpenId}
            toggleReplyInput={toggleReplyInput}
            openReplyListIds={openReplyListIds}
            toggleReplyList={toggleReplyList}
            onCommentAdded={handleCommentAdded}
            depth={0}
          />
        ))}
      </div>
    </section>
  );
}
