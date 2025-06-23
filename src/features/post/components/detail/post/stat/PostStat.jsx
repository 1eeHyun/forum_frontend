import {
    MessageSquare,
    ArrowUp,
    ArrowDown,
    Share2,
  } from "lucide-react";
  
  export default function PostStat({ likeCount, commentCount }) {
    return (
      <div className="flex gap-3 mt-6 text-sm font-medium text-gray-700 dark:text-gray-300">
        {/* Vote */}
        <div className="flex items-center bg-gray-50 dark:bg-[#1f1f1f] rounded-full overflow-hidden shadow border border-gray-300 dark:border-gray-700">
          <button
            className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            title="Upvote"
          >
            <ArrowUp className="w-4 h-4 text-gray-500 group-hover:text-orange-500 transition" />
          </button>
          <span className="px-2 text-base">{likeCount}</span>
          <button
            className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            title="Downvote"
          >
            <ArrowDown className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition" />
          </button>
        </div>
  
        {/* Comment */}
        <div className="group flex items-center gap-1 px-4 py-2 bg-gray-50 dark:bg-[#1f1f1f] rounded-full shadow border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200">
          <MessageSquare className="w-4 h-4 text-gray-500 group-hover:text-indigo-500 transition" />
          <span className="text-sm">{commentCount}</span>
        </div>
  
        {/* Share */}
        <div className="group flex items-center gap-1 px-4 py-2 bg-gray-50 dark:bg-[#1f1f1f] rounded-full shadow border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200">
          <Share2 className="w-4 h-4 text-gray-500 group-hover:text-teal-500 transition" />
          <span className="text-sm">Share</span>
        </div>
      </div>
    );
  }
  