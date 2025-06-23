import { COMMUNITIES } from "@/constants/apiRoutes";
import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";



export default function Communities(){

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
        const text = await response.text();
        try {
            const parsedResponse = JSON.parse(text);
            setCommunities(parsedResponse.data);
        } catch (jsonErr) {
            console.error("Not valid JSON:", jsonErr);
        }
        } catch (err) {
        console.error(err);
        }
    }
    fetchCommunities();
    }, []);

    return(
        <div>
            {communities.map((community) => (
                <button key={community.id} className="block my-1"
                onClick={() => navigate(`/communities/${community.id}`)}>
                {community.name}
                </button>
            ))}
        </div>
    );

}