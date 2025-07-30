import {
  Home,
  Flame,
  MessageCircle,
  Bookmark,
  User,
  Globe,
  Users,
  PlusCircle,
} from "lucide-react";

const icons = {
  home: Home,
  trending: Flame,
  chat: MessageCircle,
  saved: Bookmark,
  profile: User,
  discover: Globe,
  community: Users,
  create: PlusCircle,
};

export default function SidebarItem({ iconKey, label, isOpen, onClick }) {
  const Icon = icons[iconKey];
  
  if (!Icon) return null;

  return (
    <div className="w-full">
      <button
        onClick={onClick}
        className={`
          group flex transition-colors rounded-lg text-muted-foreground w-full
          ${isOpen
            ? "flex-row items-center gap-3 px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
            : "flex-col items-center justify-center px-4 py-4 min-h-[56px] hover:bg-gray-200 dark:hover:bg-gray-600"}
        `}
      >
        <Icon className="w-6 h-6" />
        {isOpen && <span className="text-sm">{label}</span>}
      </button>
    </div>
  );
}


