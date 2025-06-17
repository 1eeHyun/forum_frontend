import { Menu } from "lucide-react";

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-zinc-900 border-b border-gray-700 px-6 flex items-center z-50">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="text-white"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-white font-semibold text-lg">Forum</h1>
      </div>
    </header>
  );
}
