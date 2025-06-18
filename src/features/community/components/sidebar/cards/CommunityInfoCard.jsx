import { format } from "date-fns";
import { Users, MessageSquareText, CalendarDays } from "lucide-react";
import CommunityRulesList from "./CommunityRulesList";

export default function CommunityInfoCard({
  name,
  description,
  createdAt,
  memberCount,  
  postCount,
  rules = [],
  dateFormat = "MMM d, yyyy", 
}) {
  return (
    <div className="p-4 rounded-xl shadow border space-y-3 bg-white dark:bg-dark-home-sidebar-bg border-gray-300 dark:border-gray-700">
      {/* Title + Description */}
      <div>
        <h2 className="font-semibold text-xl text-black dark:text-white">
          {name}
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line mt-1">
          {description}
        </p>
      </div>

      {/* Created Date */}
      <div className="flex items-center gap-1 text-sm">
        <CalendarDays size={12} className="text-gray-600 dark:text-gray-300" />
        <span className="text-gray-600 dark:text-gray-300">
          Created {createdAt ? format(new Date(createdAt), dateFormat) : "N/A"}
        </span>
      </div>

      {/* Stats Row */}
      <div className="flex justify-around pt-2 text-center">
        <div>
          <div className="flex justify-center items-center gap-1 text-sm font-semibold text-black dark:text-white">
            <Users size={12} className="text-gray-600 dark:text-gray-300" />
            {memberCount}
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">Members</div>
        </div>

        <div>
          <div className="flex justify-center items-center gap-1 text-sm font-semibold text-black dark:text-white">
            <MessageSquareText size={12} className="text-gray-600 dark:text-gray-300" />
            {postCount}
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">Posts</div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-300 my-2 dark:border-gray-700" />

      {/* Rules Section */}
      {rules.length > 0 && <CommunityRulesList rules={rules} />}
    </div>
  );
}
