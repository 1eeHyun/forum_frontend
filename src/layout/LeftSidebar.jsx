export default function LeftSidebar({ isOpen }) {
    return (
      <div className="flex flex-col space-y-3">
        {isOpen ? (
          <>
            <a href="#" className="text-sm text-gray-300 hover:text-white">🏠 Home</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white">🔥 Trending</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white">📁 Categories</a>
          </>
        ) : (
          <>
            <span className="text-gray-400 text-xl">🏠</span>
            <span className="text-gray-400 text-xl">🔥</span>
            <span className="text-gray-400 text-xl">📁</span>
          </>
        )}
      </div>
    );
  }
  