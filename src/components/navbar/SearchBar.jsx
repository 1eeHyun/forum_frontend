import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import axios from "@/api/axios";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      axios
        .get(`/search?query=${encodeURIComponent(searchTerm)}`)
        .then((res) => {
          setResults(res.data.data);
          setShowResults(true);
        })
        .catch((err) => {
          console.error("Search error:", err);
        });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleNavigate = (url, isPost = false) => {
    if (isPost) {
      const currentPath = location.pathname;
      navigate(`${currentPath}?postId=${url}`);
    } else {
      navigate(url);
    }
    setShowResults(false);
    setSearchTerm(""); 
  };

  return (
    <div className="relative w-[600px] px-6" ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-[#2b2d31] rounded-full pl-10 pr-4 py-2 text-white focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {showResults && results && (
        <div className="absolute mt-2 w-full bg-[#18191c] rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
          {/* Users */}
          {results.users?.length > 0 && (
            <div className="p-2">
              <h3 className="text-gray-400 text-xs mb-2">Users</h3>
              {results.users.map((u) => (
                <div
                  key={u.username}
                  onClick={() => handleNavigate(`/profile/${u.username}`)}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-[#2b2d31] cursor-pointer rounded"
                >
                  <img
                    src={u.imageDto?.imageUrl || "/default-profile.jpg"}
                    alt="profile"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="text-white text-sm">
                    <p className="font-medium">{u.nickname}</p>
                    <p className="text-gray-400 text-xs">@{u.username}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Communities */}
          {results.communities?.length > 0 && (
            <div className="p-2 border-t border-gray-700">
              <h3 className="text-gray-400 text-xs mb-2">Communities</h3>
              {results.communities.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleNavigate(`/communities/${c.id}`)}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-[#2b2d31] cursor-pointer rounded"
                >
                  <img
                    src={c.imageDTO?.imageUrl || "/assets/default-community.jpg"}
                    className="w-6 h-6 rounded-full object-cover"
                    alt="community"
                  />
                  <div>
                    <p className="text-white text-sm font-medium">{c.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Posts */}
          {results.posts?.length > 0 && (
            <div className="p-2 border-t border-gray-700">
              <h3 className="text-gray-400 text-xs mb-2">Posts</h3>
              {results.posts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleNavigate(p.id, true)}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-[#2b2d31] cursor-pointer rounded"
                >
                  {p.imageUrls?.length > 0 && (
                    <img
                      src={p.imageUrls[0]}
                      alt="thumbnail"
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                  <div className="text-sm text-white">
                    <p className="font-medium">{p.title}</p>
                    <p className="text-gray-400 text-xs">by {p.authorNickname}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
