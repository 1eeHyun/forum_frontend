import { useEffect, useState } from "react";
import { getTrendingSidebar } from "@trending/services/trendingApi";
import { useNavigate } from "react-router-dom";
import { Users, Hash } from "lucide-react";

export default function TrendingRightSidebar() {
  const [communities, setCommunities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSidebarData() {
      try {
        const res = await getTrendingSidebar();
        setCommunities(res.data.data.trendingCommunities);
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
            {communities.map((community) => (
              <li
                key={community.id}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-lg transition"
                onClick={() => navigate(`/communities/${community.id}`)}
              >
                <img
                  src={community.imageDTO.imageUrl}
                  alt={community.name}
                  className="w-9 h-9 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                  style={{
                    objectPosition: `${(community.imageDTO.imagePositionX ?? 0.5) * 100}% ${(community.imageDTO.imagePositionY ?? 0.5) * 100}%`,
                  }}
                />
                <span className="text-sm font-medium dark:text-white">{community.name}</span>
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

        <div className="flex flex-wrap gap-2">
          {["#AI", "#React", "#Startup", "#UX", "#OpenAI"].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
