

export default function LeftSidebar({ isOpen }) {
    return (
      <div className="flex flex-col items-start space-y-3">
        {isOpen ? (
          <>
            <a href="#" className="text-base text-muted hover:text-primary dark:hover:text-primary">🏠 Home</a>
            <a href="#" className="text-base text-muted hover:text-primary dark:hover:text-primary">🔥 Trending</a>
            <button className="text-base text-muted hover:text-primary dark:hover:text-primary">📁 Categories</button>
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
  