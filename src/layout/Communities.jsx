import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/api/axios";
import { COMMUNITIES } from "@/constants/apiRoutes";

export default function Communities() {
  const [communities, setCommunities] = useState([]);
  const navigate = useNavigate();
  const communitiesExist = Array.isArray(communities) && communities.length > 0;

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

  return (
    <div>
      {communitiesExist ? (
        communities.map((community) => (
          <button
            key={community.id}
            className="flex items-center my-1 py-1"
            onClick={() => navigate(`/communities/${community.id}`)}
          >
            <img
            src={community.imageDTO?.imageUrl}
            alt={community.name}
            className="w-6 h-6 rounded mr-2 object-cover"
            />
            {community.name}
          </button>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No communities available.</p>
      )}
    </div>
  );
}
