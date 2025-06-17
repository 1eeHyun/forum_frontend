import { useEffect, useState } from "react";

export default function ThemeToggleButton() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") !== "light";
    }
    return true;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      html.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      html.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <label className="flex items-center justify-between w-full cursor-pointer">
      <span className="flex items-center gap-2 text-sm">        
        <span>Dark Mode</span>
      </span>
      <div className="relative">
        <input
          type="checkbox"
          checked={isDark}
          onChange={() => setIsDark(!isDark)}
          className="sr-only"
        />
        <div className="w-10 h-5 bg-gray-300 dark:bg-blue-600 rounded-full shadow-inner transition" />
        <div
          className={`absolute left-0 top-0 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300
            ${isDark ? "translate-x-5" : "translate-x-0"}`}
        >
          <span className="flex items-center justify-center h-full w-full">
            {isDark ? "✓" : ""}
          </span>
        </div>
      </div>
    </label>
  );
}