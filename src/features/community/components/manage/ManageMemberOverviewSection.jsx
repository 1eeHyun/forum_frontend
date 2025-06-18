import React, { useState } from "react";
import { Search } from "lucide-react";

export default function ManageMemberOverviewSection({ memberCount, users }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users?.filter((user) =>
    `${user.nickname} ${user.username}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-black border border-gray-700 rounded-2xl p-6 ">
      <h2 className="text-white text-xl font-semibold mb-6">Member Overview</h2>

      {/* Total + SearchBar */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-300 text-sm">
          Total Members: <span className="text-white font-semibold">{memberCount}</span>
        </p>

        {/* SearchBar with icon */}
        <div className="relative w-40">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-950 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      {/* Member Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredUsers?.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 bg-gray-950 border border-gray-600 p-3 rounded-xl hover:bg-[#1b1d20] shadow-sm transition"
          >
            <img
              src={user.profileImage?.imageUrl}
              alt={user.nickname}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.nickname}</p>
              <p className="text-gray-400 text-xs truncate">@{user.username}</p>
              <p className="text-xs mt-0.5">
                {user.role === "MANAGER" ? (
                  <span className="text-blue-200 bg-blue-900 px-2 py-0.5 rounded-full">
                    {user.role}
                  </span>
                ) : (
                  <span className="text-gray-400">{user.role}</span>
                )}
              </p>
            </div>
          </div>
        ))}

        {filteredUsers?.length === 0 && (
          <p className="text-gray-400 text-sm col-span-full text-center">No members found.</p>
        )}
      </div>
    </div>
  );
}
