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

  // leave confirm modal state
  const [leaveTargetId, setLeaveTargetId] = useState(null);

  // utils
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
      setProcessingCommunities((prev) => prev.filter((id) => id !== communityId));
    }
  };

  // open leave modal instead of leaving immediately
  const requestLeave = (communityId) => {
    if (isProcessing(communityId)) return;
    setLeaveTargetId(communityId);
  };

  const cancelLeave = () => setLeaveTargetId(null);

  const confirmLeave = async () => {
    if (!leaveTargetId) return;
    const communityId = leaveTargetId;

    if (isProcessing(communityId)) return;
    setProcessingCommunities((prev) => [...prev, communityId]);

    try {
      await leaveCommunity(communityId);
      setJoinedCommunities((prev) => prev.filter((id) => id !== communityId));
      setLeaveTargetId(null);
    } catch (error) {
      console.error("Failed to leave community", error);
      const errorMessage = error?.response?.data?.message;
      if (errorMessage === "Managers cannot leave the community directly.") {
        setModalMessage("Managers cannot leave the community directly.");
      } else {
        setModalMessage("Action failed. Please try again.");
      }
      setShowErrorModal(true);
    } finally {
      setProcessingCommunities((prev) => prev.filter((id) => id !== communityId));
    }
  };

  const handleJoin = async (communityId) => {
    if (isProcessing(communityId)) return;
    const communityExists = communities.some((c) => c.id === communityId);
    if (!communityExists) {
      console.warn("Community not found");
      return;
    }

    setProcessingCommunities((prev) => [...prev, communityId]);

    try {
      await joinCommunity(communityId);
      setJoinedCommunities((prev) => [...prev, communityId]);
    } catch (error) {
      console.error("Failed to join community", error);
      setModalMessage("Action failed. Please try again.");
      setShowErrorModal(true);
    } finally {
      setProcessingCommunities((prev) => prev.filter((id) => id !== communityId));
    }
  };

  const fetchCommunities = async () => {
    try {
      const { method, url } = COMMUNITIES.MY;
      const response = await axios({ method, url });
      const fetched = response.data?.data || [];
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
        communities.map((community) => {
          const joined = isJoined(community.id);
          const processing = isProcessing(community.id);

          return (
            <div
              key={community.id}
              className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 mb-2"
            >
              {/* Navigate to community */}
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

              {/* Favorite */}
              <button
                onClick={() => handleStarClick(community.id)}
                className="ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
                aria-label="Star community"
                disabled={processing}
              >
                <Star
                  className={`w-5 h-5 ${
                    isStarred(community.id)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>

              {/* Join / Leave */}
              <button
                onClick={() => (joined ? requestLeave(community.id) : handleJoin(community.id))}
                disabled={processing}
                className={`ml-4 px-4 py-2 rounded-full focus:outline-none transition-colors ${
                  processing
                    ? "cursor-not-allowed opacity-75"
                    : joined
                    ? "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {processing
                  ? joined
                    ? "Leaving..."
                    : "Joining..."
                  : joined
                  ? "Leave"
                  : "Join"}
              </button>
            </div>
          );
        })
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <ErrorModal
          open={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          message={modalMessage}
        />
      )}

      {/* Leave Confirm Modal */}
      {leaveTargetId !== null && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={cancelLeave}
        >
          <div
            className="bg-white dark:bg-[#1a1d21] p-6 rounded-xl shadow-lg text-black dark:text-white w-[90%] max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-2">Leave this community?</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              You will no longer be a member and may lose member-only privileges.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelLeave}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 rounded text-sm text-black dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmLeave}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-500 rounded text-sm text-white"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
