import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/api/axios";
import { COMMUNITIES } from "@/constants/apiRoutes";
import MainLayout from "@/layout/MainLayout";

export default function MyCommunitiesPage() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCommunities() {
      try {
        const { method, url } = COMMUNITIES.MY;
        const res = await axios({ method, url });
        setCommunities(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch my communities", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCommunities();
  }, []);

  return (
    <MainLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">My Communities</h1>

        {loading ? (
          <p>Loading...</p>
        ) : communities.length === 0 ? (
          <p className="text-muted-foreground italic">You're not in any community yet.</p>
        ) : (
          <div className="space-y-4">
            {communities.map((community) => (
              <div
                key={community.id}
                className="flex items-center justify-between p-4 border rounded-md dark:border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={community.imageDTO?.imageUrl}
                    alt={community.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-medium">{community.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {community.description || "No description"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/communities/${community.id}`)}
                  className="text-sm font-medium px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
