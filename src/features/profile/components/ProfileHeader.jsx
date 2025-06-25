import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { followUserToggle, checkIsFollowing } from "@profile/services/followApi";
import { fetchMe } from "@auth/services/authApi";
import FollowListModal from "./modal/FollowListModal";
import { fetchProfile } from "@profile/services/profileApi";

export default function ProfileHeader({ profile, username, isMine, posts, setProfile }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowings, setShowFollowings] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMe()
      .then(res => setCurrentUser(res.data.data))
      .catch(err => console.error("fetchMe error", err));
  }, []);

  useEffect(() => {
    if (!isMine && username) {
      checkIsFollowing(username)
        .then(res => setIsFollowing(res.data.data))
        .catch(err => console.error("Follow status error", err));
    }
  }, [username, isMine]);

  const handleFollowToggle = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await followUserToggle(username);
      setIsFollowing(prev => !prev);

      if (!currentUser) return;

      if (isMine) {
        setProfile(prev => ({
          ...prev,
          followings: isFollowing
            ? prev.followings?.filter(f => f.username !== username)
            : [...(prev.followings || []), { username, nickname: username, imageDto: null }],
        }));
      } else {
        setProfile(prev => ({
          ...prev,
          followers: isFollowing
            ? prev.followers?.filter(f => f.username !== currentUser.username)
            : [...(prev.followers || []), currentUser],
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFollowers = async () => {
    try {
      const res = await fetchProfile(username);
      setProfile(res.data.data);
      setShowFollowers(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenFollowings = async () => {
    try {
      const res = await fetchProfile(username);
      setProfile(res.data.data);
      setShowFollowings(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-wrap gap-6 md:gap-4 mb-8 items-start">
      {/* Profile image section */}
      <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${profile.imageDTO?.imageUrl})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: `${profile.imageDTO?.imagePositionX ?? 50}% ${profile.imageDTO?.imagePositionY ?? 50}%`,
          }}
        ></div>
      </div>
  
      {/* Profile information */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-3">
        {/* Username (handle) & Action button */}
          <h2 className="text-lg md:text-xl text-gray-700 dark:text-white break-all">
            @{username}
          </h2>

          {isMine ? (
            <button
              onClick={() => navigate(ROUTES.PROFILE_EDIT(username))}
              className="px-4 py-1.5 rounded text-sm bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            >
              Edit profile
            </button>
          ) : (
            <button
              onClick={handleFollowToggle}
              disabled={loading}
              className={`px-4 py-1.5 text-sm rounded text-white ${
                isFollowing
                  ? "bg-gray-400 dark:bg-gray-600"
                  : "bg-blue-500 dark:bg-blue-600"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
  
        {/* Nickname */}        
        <h2 className="text-xl md:text-2xl font-semibold text-black dark:text-white break-words">
          {profile.nickname}
        </h2>
  
        {/* Counts */}
        <div className="flex mt-2 gap-6 text-sm text-gray-700 dark:text-gray-300 flex-wrap">
          <span>
            <span className="font-semibold text-black dark:text-white">
              {profile.totalPostCount}
            </span>{" "}
            posts
          </span>
          <span
            className="cursor-pointer hover:underline"
            onClick={handleOpenFollowers}
          >
            <span className="font-semibold text-black dark:text-white">
              {profile.followers?.length ?? 0}
            </span>{" "}
            followers
          </span>
          <span
            className="cursor-pointer hover:underline"
            onClick={handleOpenFollowings}
          >
            <span className="font-semibold text-black dark:text-white">
              {profile.followings?.length ?? 0}
            </span>{" "}
            following
          </span>
        </div>
  
        {/* Modals */}
        {showFollowers && (
          <FollowListModal
            title="Followers"
            users={profile.followers || []}
            onClose={() => setShowFollowers(false)}
          />
        )}
        {showFollowings && (
          <FollowListModal
            title="Following"
            users={profile.followings || []}
            onClose={() => setShowFollowings(false)}
          />
        )}
      </div>
    </div>
  );  
}
