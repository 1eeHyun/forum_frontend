
export default function FollowListModal({ title, users, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-[#1a1c1f] rounded p-6 w-[300px] max-h-[400px] overflow-y-auto text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
          </div>
          <ul className="space-y-3">
            {users.map((u) => (
              <li key={u.username} className="flex items-center gap-3">
                <img
                  src={u.imageDto?.imageUrl || "/default-profile.jpg"}
                  alt="user"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>{u.nickname} (@{u.username})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  