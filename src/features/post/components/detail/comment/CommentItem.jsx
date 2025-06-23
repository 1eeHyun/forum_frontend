import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import CommentInput from "./CommentInput";
import CommentActions from "./CommentActions";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { formatTimeAgo } from "@/utils/dateUtils";

export default function CommentItem({
  commentId,
  commentMap,
  postId,
  replyInputOpenId,
  toggleReplyInput,
  openReplyListIds,
  toggleReplyList,
  onCommentAdded,
  depth = 0,
  user
}) {
  const navigate = useNavigate();
  const comment = commentMap.get(commentId);
  if (!comment) return null;

  const isReplyListOpen = openReplyListIds.has(comment.commentId);
  const showReplyInput = replyInputOpenId === comment.commentId;

  const imageUrl = comment.author.profileImage?.imageUrl;
  const imagePosX = comment.author.profileImage?.imagePositionX ?? 50;
  const imagePosY = comment.author.profileImage?.imagePositionY ?? 50;

  return (
    <div id={`comment-${comment.commentId}`} className="space-y-2">
      <div className="flex gap-3 mt-4 relative">
        <div
          className="w-9 h-9 rounded-full border border-gray-500 bg-cover bg-center cursor-pointer"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: `${imagePosX}% ${imagePosY}%`,
          }}
          onClick={() => navigate(ROUTES.PROFILE(comment.author.username))}
        ></div>

        <div className="flex-1">
          <div className="text-sm text-gray-300 mb-1">
            <span
              className="font-semibold text-white cursor-pointer"
              onClick={() => navigate(ROUTES.PROFILE(comment.author.username))}
            >
              @{comment.author.nickname}
            </span>{" "}
            <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
          </div>

          <div className="whitespace-pre-wrap text-white">{comment.content}</div>

          <div className="flex gap-4 text-sm text-gray-400 mt-2 items-center">
            <CommentActions commentId={comment.commentId} />
            <button className="hover:text-white" onClick={() => toggleReplyInput(comment.commentId)}>
              {showReplyInput ? "Cancel" : "Reply"}
            </button>
            {comment.replies?.length > 0 && (
              <button
                onClick={() => toggleReplyList(comment.commentId)}
                className="text-blue-400 hover:underline flex items-center gap-1 text-sm mt-2"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isReplyListOpen ? "rotate-180" : ""}`}
                  strokeWidth={3}
                />
                <span className="font-medium">{comment.replies.length} replies</span>
              </button>
            )}
          </div>

          {showReplyInput && (
            <div className="mt-2">
              <CommentInput
                postId={postId}
                parentCommentId={comment.commentId}
                user={user}
                onCommentAdded={onCommentAdded}
              />
            </div>
          )}
        </div>
      </div>

      {isReplyListOpen && comment.replies?.length > 0 && (
        <div className="ml-12 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.commentId}
              commentId={reply.commentId}
              commentMap={commentMap}
              postId={postId}
              user={user}
              replyInputOpenId={replyInputOpenId}
              toggleReplyInput={toggleReplyInput}
              openReplyListIds={openReplyListIds}
              toggleReplyList={toggleReplyList}
              onCommentAdded={onCommentAdded}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
