import { COMMUNITIES } from "@/constants/apiRoutes";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Communities() {
  const [communities, setCommunities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCommunities() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(COMMUNITIES.MY.url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          console.warn("401 Unauthorized – redirecting or handling auth");
          setCommunities([]); // fallback
          return;
        }

        const text = await response.text();

        try {
          const parsedResponse = JSON.parse(text);
          if (Array.isArray(parsedResponse?.data)) {
            setCommunities(parsedResponse.data);
          } else {
            console.warn("No valid 'data' field in response", parsedResponse);
            setCommunities([]); // fallback
          }
        } catch (jsonErr) {
          console.error("Failed to parse JSON:", jsonErr);
          setCommunities([]); // fallback
        }
      } catch (err) {
        console.error("Network or fetch error:", err);
        setCommunities([]); // fallback
      }
    }

    fetchCommunities();
  }, []);

  return (
    <div>
      {Array.isArray(communities) && communities.length > 0 ? (
        communities.map((community) => (
          <button
            key={community.id}
            className="block my-1"
            onClick={() => navigate(`/communities/${community.id}`)}
          >
            {community.name}
          </button>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No communities available.</p>
      )}
    </div>
  );
}
