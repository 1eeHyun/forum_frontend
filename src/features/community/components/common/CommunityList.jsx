import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/api/axios";
import { COMMUNITIES } from "@/constants/apiRoutes";
import {
  leaveCommunity,
  joinCommunity,
  toggleFavoriteCommunity,
} from "@community/services/communityApi";
import { Star } from "lucide-react";
import ErrorModal from "@/components/modal/ErrorModal";

export default function CommunityList() {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [starred, setStarred] = useState([]);
  const [processingCommunities, setProcessingCommunities] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Util functions
  const isJoined = (id) => joinedCommunities.includes(id);
  const isStarred = (id) => starred.includes(id);
  const isProcessing = (id) => processingCommunities.includes(id);

  const handleStarClick = async (communityId) => {
    if (isProcessing(communityId)) return;

    setProcessingCommunities((prev) => [...prev, communityId]);

    try {
      await toggleFavoriteCommunity(communityId);

      setStarred((prev) =>
        prev.includes(communityId)
          ? prev.filter((id) => id !== communityId)
          : [...prev, communityId]
      );
    } catch (error) {
      console.error("Failed to toggle favorite", error);
      setModalMessage("Failed to update favorite. Please try again.");
      setShowErrorModal(true);
    } finally {
      setProcessingCommunities((prev) =>
        prev.filter((id) => id !== communityId)
      );
    }
  };

  const handleJoinToggle = async (communityId) => {
    if (isProcessing(communityId)) return;

    const communityExists = communities.some((c) => c.id === communityId);
    if (!communityExists) {
      console.warn(`Community with id not found`);
      return;
    }

    setProcessingCommunities((prev) => [...prev, communityId]);

    const currentlyJoined = isJoined(communityId);

    try {
      if (currentlyJoined) {
        await leaveCommunity(communityId);
        setJoinedCommunities((prev) =>
          prev.filter((id) => id !== communityId)
        );
      } else {
        await joinCommunity(communityId);
        setJoinedCommunities((prev) => [...prev, communityId]);
      }
    } catch (error) {
      console.error(
        `Failed to ${currentlyJoined ? "leave" : "join"} community`,
        error
      );

      const errorMessage = error?.response?.data?.message;

      if (
        currentlyJoined &&
        errorMessage === "Managers cannot leave the community directly."
      ) {
        setModalMessage("Managers cannot leave the community directly.");
      } else {
        setModalMessage("Action failed. Please try again.");
      }

      setShowErrorModal(true);
    } finally {
      setProcessingCommunities((prev) =>
        prev.filter((id) => id !== communityId)
      );
    }
  };

  const fetchCommunities = async () => {
    try {
      const { method, url } = COMMUNITIES.MY;
      const response = await axios({ method, url });
      const fetched = response.data?.data || [];git       

      setCommunities(fetched);
      setJoinedCommunities(fetched.map((c) => c.id));
      setStarred(fetched.filter((c) => c.favorite).map((c) => c.id));
    } catch (err) {
      console.error("Failed to fetch communities", err);
      setCommunities([]);
      setJoinedCommunities([]);
      setStarred([]);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  return (
    <>
      {communities.length === 0 ? (
        <p className="text-sm text-muted text-center">
          You have not joined any communities.
        </p>
      ) : (
        communities.map((community) => (
          <div
            key={community.id}
            className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 mb-2"
          >
            {/* Community navigation button */}
            <button
              onClick={() => navigate(`/communities/${community.id}`)}
              className="flex items-center flex-1 justify-between px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-2">
                <img
                  src={community.imageDTO?.imageUrl}
                  alt={community.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-lg text-foreground">{community.name}</span>
              </div>
            </button>

            {/* Favorite star button */}
            <button
              onClick={() => handleStarClick(community.id)}
              className="ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
              aria-label="Star community"
              disabled={isProcessing(community.id)}
            >
              <Star
                className={`w-5 h-5 ${
                  isStarred(community.id)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            </button>

            {/* Join/Leave button */}
            <button
              onClick={() => handleJoinToggle(community.id)}
              disabled={isProcessing(community.id)}
              className={`ml-4 px-4 py-2 rounded-full focus:outline-none transition-colors ${
                isProcessing(community.id)
                  ? "cursor-not-allowed opacity-75"
                  : isJoined(community.id)
                  ? "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isProcessing(community.id)
                ? isJoined(community.id)
                  ? "Leaving..."
                  : "Joining..."
                : isJoined(community.id)
                ? "Leave"
                : "Join"}
            </button>
          </div>
        ))
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <ErrorModal
          open={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          message={modalMessage}
        />
      )}
    </>
  );
}
