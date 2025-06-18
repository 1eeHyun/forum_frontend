import React from "react";

export default function ManageProfileImageSection({ community }) {
  return (
    <div className="bg-[#1a1c1f] border border-gray-700 rounded-xl p-6">
      <h2 className="text-white text-xl font-semibold mb-4">Community Profile Image</h2>
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white">
        <img
          src={community.profileImageDto?.imageUrl || "/assets/default-profile.jpg"}
          alt="profile"
          className="w-full h-full object-cover"
          style={{
            objectPosition: `${(community.profileImageDto?.imagePositionX ?? 0.5) * 100}% ${(community.profileImageDto?.imagePositionY ?? 0.5) * 100}%`
          }}
        />
      </div>
      {/* TODO: Add upload/change button */}
    </div>
  );
}