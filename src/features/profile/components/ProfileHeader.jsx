export default function ProfileHeader({ profile, username, isMine, posts, setProfile }) {
    return (
      <div className="flex items-center gap-4 mb-6">
        <img
          src={profile.imageDTO?.imageUrl}
          className="w-20 h-20 rounded-full object-cover"
          alt="profile"
        />
        <div>
          <h2 className="text-xl font-bold">{profile.nickname}</h2>
          <p className="text-sm text-gray-400">{profile.bio}</p>
          <p className="text-xs text-gray-500">
            {profile.followers.length} followers · {profile.followings.length} following
          </p>
          {isMine && <button className="text-sm text-blue-400 underline">Edit Profile</button>}
        </div>
      </div>
    );
  }
  