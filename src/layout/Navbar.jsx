import { Menu } from "lucide-react";
import ThemeToggleButton from "@/components/ThemeToggleButton";

export default function Navbar({ onToggleSidebar }) {
  return (
    <header
      className={`
        fixed top-0 left-0 right-0 h-14 z-50 px-6 flex items-center justify-between
        bg-card-bg border-b border-card text-black
        dark:bg-dark-card-bg dark:border-dark-card dark:text-white
      `}
    >
      {/* Left: Menu + Logo */}
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="text-inherit">
          <Menu size={24} />
        </button>
        <h1 className="font-semibold text-lg">Forum</h1>
      </div>

      {/* Right: Theme toggle */}
      <ThemeToggleButton />
    </header>
  );
}
