import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/api/axios";
import { COMMUNITIES } from "@/constants/apiRoutes";
import { ChevronDown, Plus, Settings, Star, Users } from "lucide-react";


export default function CommunityList(){
    const navigate = useNavigate();
    const [communities, setCommunities] = useState([]);
    const [starred, setStarred] = useState([]); 

    const handleStarClick = (communityId) => {
        setStarred((prev) =>
        prev.includes(communityId)
            ? prev.filter((id) => id !== communityId)
            : [...prev, communityId]
        );
    };
    
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

    return (<>
        {communities.map((community) => (
            <div
                key={community.id}
                className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 mb-2"
        >
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
            <button
                onClick={() => handleStarClick(community.id)}
                className="ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
                aria-label="Star community">
                    <Star 
                    className={`w-5 h-5 ${
                        starred.includes(community.id) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                    }`}
                    />
                </button>
            </div>
          ))}</>)
}