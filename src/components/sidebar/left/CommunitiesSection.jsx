import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Plus, Settings, Star, Users } from "lucide-react";
import axios from "@/api/axios";
import { COMMUNITIES } from "@/constants/apiRoutes";
import { ROUTES } from "@/constants/apiRoutes/routes";

const BATCH_SIZE = 5;

export default function CommunitiesSection({ isOpen }) {
  const [communities, setCommunities] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const navigate = useNavigate();

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

  if (!isOpen) {
    return (
      <button
        onClick={() => navigate(ROUTES.MY_COMMUNITY)}
        className="flex flex-col items-center justify-center w-full py-3 px-4 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-muted-foreground"
      >
        <Users className="w-6 h-6" />
      </button>
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

          {communities.slice(0, visibleCount).map((community) => (
            <button
              key={community.id}
              onClick={() => navigate(`/communities/${community.id}`)}
              className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-2">
                <img
                  src={community.imageDTO?.imageUrl}
                  alt={community.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-foreground">{community.name}</span>
              </div>
              <Star className="w-4 h-4 text-muted-foreground" />
            </button>
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
