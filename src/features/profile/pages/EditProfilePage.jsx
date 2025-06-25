import { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom"; 
import { fetchProfile } from "../services/profileApi";
import { ROUTES } from "@/constants/api/routes";

export default function EditProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [currentUsername, setCurrentUsername] = useState(null);
  const [profile, setProfile] = useState({
    nickname: "",
    bio: "",
    imageDTO: {
      imageUrl: "/default-profile.jpg",
      imagePositionX: 50,
      imagePositionY: 50
    }
  });

  useEffect(() => {
    const updateUsername = () => {
      setCurrentUsername(localStorage.getItem("username"));
    };

    updateUsername();
    window.addEventListener("storage", updateUsername);
    return () => window.removeEventListener("storage", updateUsername);
  }, []);

  useEffect(() => {
    if (username && username === currentUsername) {
      fetchProfile(username)
        .then(res => setProfile(res.data.data))
        .catch(() => {});
    }
  }, [username, currentUsername]);

  if (currentUsername === null) return null;

  if (username !== currentUsername) {
    return <Navigate to={ROUTES.PROFILE(username)} replace />;
  }

  return (
    <div className="max-w-md mx-auto mt-6 space-y-6">
      <div className="flex flex-col items-center">
        <div
          className="w-24 h-24 rounded-full border border-gray-500 bg-cover bg-center"
          style={{
            backgroundImage: `url(${profile.imageDTO?.imageUrl})`,
            backgroundPosition: `${profile.imagePositionX || 50}% ${profile.imagePositionY || 50}%`,
          }}
        ></div>

        <button
          onClick={() => navigate(ROUTES.PROFILE_EDIT_PICTURE(username))}
          className="text-sm text-blue-400 mt-2 hover:underline"
        >
          Edit picture
        </button>
      </div>

      <EditCard title="Name" value={profile.nickname} path={ROUTES.PROFILE_EDIT_NICKNAME(username)} />
      <EditCard title="Username" value={username} path={ROUTES.PROFILE_EDIT_USERNAME(username)} />
      <EditCard title="Bio" value={profile.bio} path={ROUTES.PROFILE_EDIT_BIO(username)} />
    </div>
  );

  function EditCard({ title, value, path }) {
    return (
      <div
        onClick={() => navigate(path)}
        className="bg-[#1e1e1e] p-4 rounded hover:bg-[#2a2a2a] cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-4">
          <h3 className="text-white font-semibold w-24 shrink-0">{title}</h3>
          <p className="text-gray-400 text-sm truncate">
            {value || `No ${title.toLowerCase()} set.`}
          </p>
        </div>
      </div>
    );
  }
}
