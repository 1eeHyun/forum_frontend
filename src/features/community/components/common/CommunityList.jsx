import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/api/axios";
import { COMMUNITIES } from "@/constants/apiRoutes";
import { leaveCommunity, joinCommunity } from "../../services/communityApi";
import { ChevronDown, Plus, Settings, Star, Users } from "lucide-react";

export default function CommunityList(){
    const navigate = useNavigate();
    const [communities, setCommunities] = useState([]);
    const [joinedCommunities, setJoinedCommunities] = useState([]);
    const [starred, setStarred] = useState([]);
    const [processingCommunities, setProcessingCommunities] = useState([]);
    
    const handleStarClick = (communityId) => {
        setStarred((prev) =>
            prev.includes(communityId)
                ? prev.filter((id) => id !== communityId)
                : [...prev, communityId]
        );
    };
    
    const handleJoinToggle = async(communityId) => {
        const communityExists = communities.some(community => community.id === communityId);
        const isCurrentlyJoined = joinedCommunities.includes(communityId);
        
        if (!communityExists) {
            console.warn(`Community with id ${communityId} not found`);
            return;
        }
        
        // Add to processing state
        setProcessingCommunities(prev => [...prev, communityId]);
        
        try{
            if(isCurrentlyJoined){
                await leaveCommunity(communityId);
                setJoinedCommunities(prev => prev.filter(id => id !== communityId));
            }
            else{
                await joinCommunity(communityId);
                setJoinedCommunities(prev => [...prev, communityId]);
            }
        } catch (error){
            console.error(`Failed to ${isCurrentlyJoined ? 'leave' : 'join'} community`, error);
        } finally {
            setProcessingCommunities(prev => prev.filter(id => id !== communityId));
        }
    };
   
    useEffect(() => {
        async function fetchCommunities() {
            try {
                const { method, url } = COMMUNITIES.MY;
                const response = await axios({ method, url });
                const fetchedCommunities = response.data?.data || [];
                setCommunities(fetchedCommunities);
                
                // Since COMMUNITIES.MY returns joined communities, set them as joined
                setJoinedCommunities(fetchedCommunities.map(community => community.id));
                
            } catch (err) {
                console.error("Failed to fetch communities", err);
                setCommunities([]);
                setJoinedCommunities([]);
            }
        }
        fetchCommunities();
    }, []);
    
    return (
        <>
            {communities.map((community) => {
                const isJoined = joinedCommunities.includes(community.id);
                const isProcessing = processingCommunities.includes(community.id);
                
                return (
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
                            aria-label="Star community"
                        >
                            <Star
                                className={`w-5 h-5 ${
                                    starred.includes(community.id) 
                                        ? "text-yellow-400 fill-yellow-400" 
                                        : "text-muted-foreground"
                                }`}
                            />
                        </button>
                        
                        <button 
                            onClick={() => handleJoinToggle(community.id)}
                            disabled={isProcessing}
                            className={`ml-4 px-4 py-2 rounded-full focus:outline-none transition-colors ${
                                isProcessing
                                    ? "cursor-not-allowed opacity-75"
                                    : ""
                            } ${
                                isJoined
                                    ? isProcessing
                                        ? "bg-red-400 text-white"
                                        : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                                    : isProcessing
                                        ? "bg-blue-400 text-white"
                                        : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}
                        >
                            {isProcessing 
                                ? (isJoined ? "Leaving..." : "Joining...")
                                : (isJoined ? "Leave" : "Join")
                            }
                        </button>
                    </div>
                );
            })}
        </>
    );
}