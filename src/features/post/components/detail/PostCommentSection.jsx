export default function PostCommentSection({ comments }) {
    return (
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-black dark:text-white mb-4">Comments</h2>
  
        {comments?.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">No comments yet.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
              >
                <div className="flex items-center gap-2 mb-2 text-sm text-gray-600 dark:text-gray-400">
                  <img
                    src={comment.author.profileImage?.imageUrl || "/assets/default-profile.jpg"}
                    alt="commenter"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="font-medium text-black dark:text-white">{comment.author.nickname}</span>
                  <span className="text-xs">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-black dark:text-white whitespace-pre-line">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  