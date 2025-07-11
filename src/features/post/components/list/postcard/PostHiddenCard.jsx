import React from "react";

export default function PostHiddenCard({ onUndo }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a] px-6 py-5 text-gray-800 dark:text-gray-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">This post is hidden.</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUndo?.();
          }}
          className="px-4 py-1.5 text-sm font-medium bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Undo
        </button>
      </div>
    </div>
  );
}
