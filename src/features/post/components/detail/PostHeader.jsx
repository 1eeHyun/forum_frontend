import { formatDistanceToNow } from "date-fns";

export default function PostHeader({ title, author, createdAt, community }) {
  return (
    <div className="flex flex-col gap-2 border-b pb-4 mb-4 border-gray-300 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-black dark:text-white">{title}</h1>

      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <img
          src={author.profileImage?.imageUrl || "/assets/default-profile.jpg"}
          alt="Author"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="font-medium text-black dark:text-white">{author.nickname}</span>
        <span>•</span>
        <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
        <span>•</span>
        <span className="text-blue-600 dark:text-blue-400 font-medium">{community.name}</span>
      </div>
    </div>
  );
}
