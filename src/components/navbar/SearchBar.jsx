import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { SEARCH_API } from "@/constants/apiRoutes/search";
import { SEARCH_LABELS } from "@/constants/labels/uiLabels";
import { POST_NAVIGATION } from "@/constants/navigation/postRoutes";
import { USER_NAVIGATION } from "@/constants/navigation/userRoutes";
import { COMMUNITY_NAVIGATION } from "@/constants/navigation/communityRoutes";

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
        .get(SEARCH_API.QUERY(searchTerm))
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

  const handleNavigate = (target, isPost = false) => {
    if (isPost) {
      navigate(POST_NAVIGATION.withPostId(location.pathname, target));
    } else {
      navigate(target);
    }
    setShowResults(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-[600px] px-6" ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          placeholder={SEARCH_LABELS.PLACEHOLDER}
          className="w-full bg-card dark:bg-dark-card text-black dark:text-white rounded-full pl-10 pr-4 py-2 placeholder-muted dark:placeholder-dark-muted focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted dark:text-dark-muted" />
      </div>

      {showResults && results && (
        <div className="absolute mt-2 w-full bg-card-bg dark:bg-dark-card-bg border border-card dark:border-dark-card rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
          {results.users?.length > 0 && (
            <div className="p-2">
              <h3 className="text-muted dark:text-dark-muted text-sm mb-2 font-semibold">
                {SEARCH_LABELS.USERS}
              </h3>
              {results.users.map((u) => (
                <div
                key={u.username}
                onClick={() => handleNavigate(USER_NAVIGATION.profile(u.username))}
                className="flex items-center gap-2 px-2 py-1 hover:bg-card-hover dark:hover:bg-dark-card-hover cursor-pointer rounded"
              >
                <img
                  src={u.imageDto?.imageUrl}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="text-sm text-black dark:text-white">
                  <p className="font-medium">{u.nickname}</p>
                  <p className="text-muted dark:text-dark-muted text-xs">
                    @{u.username}
                  </p>
                </div>
              </div>
              ))}
            </div>
          )}

          {results.communities?.length > 0 && (
            <div className="p-2 border-t border-card dark:border-dark-card">
              <h3 className="text-muted dark:text-dark-muted text-sm mb-2 font-semibold">
                {SEARCH_LABELS.COMMUNITIES}
              </h3>
              {results.communities.map((c) => (
                  <div
                  key={c.id}
                  onClick={() => handleNavigate(COMMUNITY_NAVIGATION.detail(c.id))}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-card-hover dark:hover:bg-dark-card-hover cursor-pointer rounded"
                >
                  <img
                    src={c.imageDTO?.imageUrl}
                    className="w-8 h-8 rounded-full object-cover"
                    alt="community"
                  />
                  <p className="text-sm text-black dark:text-white font-medium">
                    {c.name}
                  </p>
                </div>
              ))}
            </div>
          )}

          {results.posts?.length > 0 && (
            <div className="p-2 border-t border-card dark:border-dark-card">
              <h3 className="text-muted dark:text-dark-muted text-sm mb-2 font-semibold">
                {SEARCH_LABELS.POSTS}
              </h3>
              {results.posts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleNavigate(p.id, true)}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-card-hover dark:hover:bg-dark-card-hover cursor-pointer rounded"
                >
                  {p.imageUrls?.length > 0 && (
                    <img
                      src={p.imageUrls[0]}
                      alt="thumbnail"
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                  <div className="text-sm text-black dark:text-white">
                    <p className="font-medium">{p.title}</p>
                    <p className="text-muted dark:text-dark-muted text-xs">
                      {SEARCH_LABELS.BY} {p.authorNickname}
                    </p>
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
