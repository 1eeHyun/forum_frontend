export default function HomeRightSidebar() {
    const trendingCommunities = [
      { id: 1, name: "reactjs" },
      { id: 2, name: "frontend" },
      { id: 3, name: "webdev" },
    ];
  
    return (
      <div className="space-y-6">
        <section>
          <h2 className="text-sm text-gray-400 font-semibold mb-2">
            Trending Communities
          </h2>
          <ul className="space-y-2">
            {trendingCommunities.map((c) => (
              <li key={c.id} className="text-white text-sm hover:underline cursor-pointer">
                r/{c.name}
              </li>
            ))}
          </ul>
        </section>
  
        <section>
          <h2 className="text-sm text-gray-400 font-semibold mb-2">Site Info</h2>
          <p className="text-xs text-gray-500">
            Welcome to Forum! This is a mock community site.
          </p>
        </section>
      </div>
    );
  }
  