export default function LeftSidebar({ isOpen }) {
    return (
      <div className="flex flex-col space-y-3">
        {isOpen ? (
          <>
            <a href="#" className="text-sm text-muted hover:text-white dark:hover:text-primary">🏠 Home</a>
            <a href="#" className="text-sm text-muted hover:text-white dark:hover:text-primary">🔥 Trending</a>
            <a href="#" className="text-sm text-muted hover:text-white dark:hover:text-primary">📁 Categories</a>
          </>
        ) : (
          <>
            <span className="text-muted text-xl">🏠</span>
            <span className="text-muted text-xl">🔥</span>
            <span className="text-muted text-xl">📁</span>
          </>
        )}
      </div>
    );
  }
  