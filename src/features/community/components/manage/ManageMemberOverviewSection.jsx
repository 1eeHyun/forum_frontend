import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { getCommunityMembers } from "@community/services/communityApi";

export default function ManageMemberOverviewSection({ communityId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await getCommunityMembers(communityId);
        setMembers(response.data);
      } catch (err) {
        console.error("Failed to fetch members:", err);
      }
    };

    fetchMembers();
  }, [communityId]);

  const filteredUsers = members?.filter((user) => {
    const nickname = user.name || "";
    const username = user.username || "";
    return `${nickname} ${username}`.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="bg-action-hover dark:bg-black border border-gray-300 dark:border-gray-700 rounded-2xl p-6">
      <h2 className="text-black dark:text-white text-xl font-semibold mb-3">Member Overview</h2>
  
      {/* Total Members + Search */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Total Members: <span className="text-black dark:text-white font-semibold">{members.length}</span>
        </p>
  
        <div className="relative w-40">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-950 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>
  
      {/* Member Cards inside border box */}
      <div className="border bg-white border-gray-300 dark:border-gray-700 rounded-xl p-4">
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
          {filteredUsers?.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 bg-gray-100 dark:bg-gray-950 border border-gray-300 dark:border-gray-600 p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-[#1b1d20] shadow-sm transition"
            >
              <img
                src={user.profileImage?.imageUrl}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-black dark:text-white text-sm font-medium truncate">{user.name}</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs truncate">@{user.username}</p>
                <p className="text-xs mt-0.5">
                  {user.role === "MANAGER" ? (
                    <span className="text-blue-700 dark:text-blue-200 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded-full">
                      {user.role}
                    </span>
                  ) : (
                    <span className="text-gray-600 dark:text-gray-400">{user.role}</span>
                  )}
                </p>
              </div>
            </div>
          ))}
  
          {filteredUsers?.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-sm col-span-full text-center">No members found.</p>
          )}
        </div>
      </div>
    </div>
  );  
}
