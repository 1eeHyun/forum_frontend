import { useEffect, useState } from "react";
import { getTrendingSidebar } from "@trending/services/trendingApi";
import { useNavigate } from "react-router-dom";
import { Users, Hash } from "lucide-react";

export default function TrendingRightSidebar() {
  const [communities, setCommunities] = useState([]);
  const [hotTags, setHotTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSidebarData() {
      try {
        const res = await getTrendingSidebar({ communityLimit: 5, tagLimit: 10 });
        const data = res.data?.data;
        setCommunities(data?.trendingCommunities ?? []);
        setHotTags(data?.hotTags ?? []);
      } catch (err) {
        console.error("Failed to load trending sidebar", err);
      }
    }
    fetchSidebarData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Trending Communities */}
      <div className="bg-white dark:bg-dark-home-sidebar-bg p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-base font-semibold dark:text-white">Trending Communities</h2>
        </div>

        {communities.length === 0 ? (
          <p className="text-sm text-muted dark:text-dark-muted">No trending communities</p>
        ) : (
          <ul className="space-y-3">
            {communities.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-lg transition"
                onClick={() => navigate(`/communities/${c.id}`)}
              >
                <img
                  src={c.imageDTO?.imageUrl}
                  alt={c.name}
                  className="w-9 h-9 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                  style={{
                    // Center crop using saved X/Y position (0~1)
                    objectPosition: `${((c.imageDTO?.imagePositionX ?? 0.5) * 100).toFixed(2)}% ${((c.imageDTO?.imagePositionY ?? 0.5) * 100).toFixed(2)}%`,
                  }}
                />
                <span className="text-sm font-medium dark:text-white">{c.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Hot Tags */}
      <div className="bg-white dark:bg-dark-home-sidebar-bg p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="w-5 h-5 text-pink-500 dark:text-pink-400" />
          <h2 className="text-base font-semibold dark:text-white">Hot Tags</h2>
        </div>

        {hotTags.length === 0 ? (
          <p className="text-sm text-muted dark:text-dark-muted">No hot tags</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {hotTags.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => navigate(`/tags/${encodeURIComponent(name)}`)} // navigate to a tag page
                className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                title={`#${name}`}
              >
                #{name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
