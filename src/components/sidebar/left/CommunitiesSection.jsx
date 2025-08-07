import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Plus, Settings, Star, Users } from "lucide-react";
import axios from "@/api/axios";
import { COMMUNITIES } from "@/constants/apiRoutes";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { toggleFavoriteCommunity } from "@community/services/communityApi";

const BATCH_SIZE = 5;

export default function CommunitiesSection({ isOpen }) {
  const [communities, setCommunities] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const navigate = useNavigate();

  const sortedCommunities = [...communities].sort((a, b) => {  
    return (b.favorite === true) - (a.favorite === true);
  });

  useEffect(() => {
    async function fetchCommunities() {
      try {
        const { method, url } = COMMUNITIES.MY;
        const response = await axios({ method, url });
        setCommunities(response.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch communities", err);
        setCommunities([]);
      }
    }

    fetchCommunities();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + BATCH_SIZE);
  };

  const handleToggleFavorite = async (communityId) => {
    try {
      await toggleFavoriteCommunity(communityId);
      setCommunities((prev) =>
        prev.map((c) =>
          c.id === communityId ? { ...c, favorite: !c.favorite } : c
        )
      );
    } catch (err) {
      console.error("Failed to toggle favorite community", err);
    }
  };

  if (!isOpen) {
    return (
      <>
        
      </>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {/* Title with rotating toggle icon */}
      <div
        className="flex items-center justify-between px-2 cursor-pointer select-none"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <h2 className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
          Communities
        </h2>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </div>

      {expanded && (
        <>
          <button
            onClick={() => navigate(ROUTES.CREATE_COMMUNITY)}
            className="flex items-center gap-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-3 rounded-md"
          >
            <Plus className="w-5 h-5" />
            Create a community
          </button>

          <button
            onClick={() => navigate(ROUTES.COMMUNITY_MANAGABLE)}
            className="flex items-center gap-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-3 rounded-md"
          >
            <Settings className="w-5 h-5" />
            Manage communities
          </button>

          {sortedCommunities.slice(0, visibleCount).map((community) => (
            <div
              key={community.id}
              className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <button
                onClick={() => navigate(`/communities/${community.id}`)}
                className="flex items-center gap-2"
              >
                <img
                  src={community.imageDTO?.imageUrl}
                  alt={community.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-foreground">{community.name}</span>
              </button>

              <button
                onClick={() => handleToggleFavorite(community.id)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Star
                  className={`w-4 h-4 ${
                    community.favorite
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            </div>
          ))}

          {/* More Button */}
          {visibleCount < communities.length && (
            <button
              onClick={handleLoadMore}
              className=" text-sm font-medium px-2 py-2 rounded-full dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              See more
            </button>
          )}
        </>
      )}
    </div>
  );
}
