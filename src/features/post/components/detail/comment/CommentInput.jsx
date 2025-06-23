import { useEffect, useRef, useState } from "react";
import { createComment, replyComment } from "@/features/post/services/postApi";
import EmojiPicker from "emoji-picker-react";
import LoginModal from "@/features/auth/components/LoginModal";
import { Smile } from "lucide-react";

export default function CommentInput({ postId, parentCommentId = null, onCommentAdded, user }) {
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const inputRef = useRef(null);
  const emojiBtnRef = useRef(null);

  useEffect(() => {
    if (showEmojiPicker && emojiBtnRef.current) {
      const rect = emojiBtnRef.current.getBoundingClientRect();
      setOpenUpward(window.innerHeight - rect.bottom < 350);
    }
  }, [showEmojiPicker]);

  const handleFocus = () => setExpanded(true);
  const handleCancel = () => {
    setComment("");
    setExpanded(false);
    setShowEmojiPicker(false);
  };

  const handleSubmit = async () => {
    if (submitting || !comment.trim() || !postId) return;
    setSubmitting(true);
    try {
      const fn = parentCommentId == null ? createComment : replyComment;
      const res = await fn({ content: comment, postId, parentCommentId });
      const newComment = res?.data?.data;
  
      if (newComment) {
        onCommentAdded?.({
          ...newComment,
          parentCommentId,
        });
      }
  
      setComment("");
      setShowEmojiPicker(false);
    } finally {
      setSubmitting(false);
    }
  };

  const imageUrl = user?.profileImage?.imageUrl;
  const posX = user?.profileImage?.imagePositionX ?? 50;
  const posY = user?.profileImage?.imagePositionY ?? 50;
  
  // User not logging-in
  if (!user) {
    return (
      <>
        <div className="p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] shadow-md">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Want to join the conversation?</p>
          <button
            type="button"
            onClick={() => setShowLoginModal(true)}
            className="inline-block text-sm text-white dark:text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-md transition"
          >
            Sign in to comment
          </button>
        </div>

        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} />
        )}
      </>
    );
  }

  // user logging-in
  return (
    <div className="flex gap-3 mt-4 relative">
      <div
        className="w-9 h-9 rounded-full border border-gray-400 dark:border-gray-600 bg-cover bg-center"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundPosition: `${posX}% ${posY}%`,
        }}
      />

      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={comment}
          onFocus={handleFocus}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Add a comment..."
          className="w-full bg-transparent border-b border-gray-400 dark:border-gray-700 outline-none text-black dark:text-white px-1 pb-1 placeholder-gray-500 dark:placeholder-gray-400"
        />

        {expanded && (
          <div className="flex items-center justify-between mt-2">
            {/* Emoji */}
            <div className="relative">
              <button
                ref={emojiBtnRef}
                type="button"
                onClick={() => setShowEmojiPicker((v) => !v)}
                className="w-7 h-7 flex items-center justify-center hover:text-yellow-500 transition"
              >
                <Smile size={18} />
              </button>

              {showEmojiPicker && (
                <div
                  className={`absolute z-50 shadow-lg ${
                    openUpward ? "bottom-full mb-2" : "top-full mt-2"
                  } w-[350px] max-w-[90vw]`}
                  style={{ maxHeight: "250px", overflowY: "auto" }}
                >
                  <EmojiPicker
                    onEmojiClick={(e) => {
                      setComment((prev) => prev + e.emoji);
                    }}
                    theme="auto"
                    width="100%"
                  />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="text-sm text-gray-500 dark:text-gray-300 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!comment.trim() || submitting}
                className={`text-sm font-medium px-4 py-1 rounded-full transition-colors ${
                  comment.trim() && !submitting
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
              >
                {submitting ? "Posting..." : "Comment"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
