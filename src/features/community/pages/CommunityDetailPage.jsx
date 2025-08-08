import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchCommunityInfo, joinCommunity } from "@community/services/communityApi";
import { AlignLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import useLoginModal from "@/hooks/auth/useLoginModal";

import CommunityHeader from "@community/components/CommunityHeader";
import PostList from "@post/components/list/PostList";
import CommunityRightSidebar from "@community/components/sidebar/CommunityRightSidebar";
import MainLayout from "@/layout/MainLayout";

// Sort options
const SORT_OPTIONS = [
  { label: "Top liked", value: "top" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

// Styles
const STYLES = {
  categoryFilter:
    "bg-gray-200 dark:bg-[#2b2f33] text-sm text-black dark:text-white px-3 py-1 rounded-full border border-gray-400 dark:border-gray-600",
  sortButton:
    "flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white",
  modalContainer:
    "bg-white dark:bg-[#1a1d21] p-6 rounded-xl shadow-lg text-black dark:text-white w-[90%] max-w-sm",
  modalButton:
    "px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 rounded text-sm text-black dark:text-white",
  confirmButton:
    "px-4 py-2 bg-blue-500 dark:bg-blue-600 hover:bg-blue-400 dark:hover:bg-blue-500 rounded text-sm text-white",
  hoverRed: "hover:text-red-500 text-gray-500 dark:text-gray-400",
};

// Query param helper
const updateQueryParams = (params, navigate, location) => {
  const updated = new URLSearchParams(location.search);
  Object.keys(params).forEach((k) => {
    if (params[k]) updated.set(k, params[k]);
    else updated.delete(k);
  });
  navigate({ search: updated.toString() });
};

export default function CommunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoggedIn } = useAuth();
  const { open: openLoginModal } = useLoginModal();

  const query = new URLSearchParams(location.search);
  const categoryFromQuery = query.get("category");

  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const sortDropdownRef = useRef(null);

  const fetchCommunityDetail = async () => {
    try {
      const communityData = await fetchCommunityInfo(id, "detail");
      setCommunity(communityData);
    } catch (err) {
      console.error("Failed to fetch community:", err);
    }
  };

  const fetchCommunityPosts = async () => {
    try {
      const params = new URLSearchParams();
      params.set("sort", sortOption);
      if (categoryFromQuery) params.set("category", categoryFromQuery);
      const postData = await fetchCommunityInfo(id, "posts", params);
      setPosts(postData);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  const handleConfirmJoin = async () => {
    try {
      await joinCommunity(id);
      setShowJoinModal(false);
      await Promise.all([fetchCommunityDetail(), fetchCommunityPosts()]);
    } catch (err) {
      console.error("Failed to join community:", err);
    }
  };

  // Initial + deps
  useEffect(() => {
    fetchCommunityDetail();
    fetchCommunityPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, sortOption, categoryFromQuery]);

  // Refresh when login state changes
  useEffect(() => {
    if (!id) return;
    fetchCommunityDetail();
    fetchCommunityPosts();
  }, [isLoggedIn, id]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setShowSortDropdown(false);
      }
    };
    if (showSortDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSortDropdown]);

  if (!community) return <div className="text-black dark:text-white p-4">Loading...</div>;

  const { role } = community || {};
  const isMember = role === "MANAGER" || role === "MEMBER";

  // ✅ Show Join whenever NOT a member/manager (guest/null/undefined all show)
  const showJoinButton = !isMember;

  const CategoryFilter = () => {
    if (!categoryFromQuery) return null;
    return (
      <div className="flex items-center gap-2 mt-4 mb-2">
        <span className="text-sm text-gray-400">Filtering by:</span>
        <div className={`inline-flex items-center gap-1 ${STYLES.categoryFilter}`}>
          <span className="font-medium">{categoryFromQuery}</span>
          <button
            onClick={() => updateQueryParams({ category: null }, navigate, location)}
            className={STYLES.hoverRed}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 8.586L15.95 2.636a1 1 0 111.414 1.414L11.414 10l5.95 5.95a1 1 0 01-1.414 1.414L10 11.414l-5.95 5.95a1 1 0 01-1.414-1.414L8.586 10 2.636 4.05A1 1 0 014.05 2.636L10 8.586z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const SortDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setShowSortDropdown((prev) => !prev)}
        className={`flex items-center gap-1 ${showSortDropdown ? "text-black dark:text-white" : STYLES.sortButton}`}
      >
        <AlignLeft size={16} /> Sort by
      </button>
      {showSortDropdown && (
        <div
          ref={sortDropdownRef}
          className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 rounded shadow z-10"
        >
          {SORT_OPTIONS.map(({ label, value }) => (
            <div
              key={value}
              onClick={() => {
                setSortOption(value);
                setShowSortDropdown(false);
              }}
              className={`px-4 py-2 cursor-pointer transition-colors ${
                sortOption === value
                  ? "bg-gray-100 dark:bg-[#272d31] text-black dark:text-white"
                  : "text-gray-700 dark:text-gray-300"
              } hover:bg-gray-200 dark:hover:bg-gray-700 ${
                value === "oldest" ? "border-none" : "border-b border-gray-200 dark:border-gray-700"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <MainLayout rightSidebar={<CommunityRightSidebar communityId={community.id} />}>
      <div className="text-black dark:text-white">
        <CommunityHeader
          community={community}
          role={role}
          showJoinButton={showJoinButton}
          onJoinClick={() => {
            if (!isLoggedIn) {
              const maybe = openLoginModal?.({
                onSuccess: () => {
                  fetchCommunityDetail();
                  fetchCommunityPosts();
                },
              });
              if (!maybe) openLoginModal();
            } else {
              // Already logged in but not a member → show join confirm
              setShowJoinModal(true);
            }
          }}
          // After leaving, refetch to reflect new role → Join shows automatically
          onLeaveSuccess={() => {
            fetchCommunityDetail();
            fetchCommunityPosts();
          }}
          onCategoryAdded={fetchCommunityDetail}
        />

        <CategoryFilter />
        <SortDropdown />

        {posts?.length > 0 && (
          <div className="py-6">
            <PostList posts={posts} />
          </div>
        )}

        {/* Join Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className={STYLES.modalContainer}>
              <h2 className="text-lg font-bold mb-4">Join this community?</h2>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowJoinModal(false)} className={STYLES.modalButton}>
                  Cancel
                </button>
                <button onClick={handleConfirmJoin} className={STYLES.confirmButton}>
                  Join
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
