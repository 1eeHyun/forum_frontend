export default function TrendingRightSidebar() {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-dark-card-bg p-4 rounded-xl shadow">
        <h2 className="text-base font-semibold mb-2 dark:text-white">💬 Trending Communities</h2>
        <ul className="text-sm text-gray-700 dark:text-dark-muted space-y-1">
          <li>#technology</li>
          <li>#design</li>
          <li>#gaming</li>
          <li>#science</li>
        </ul>
      </div>

      <div className="bg-white dark:bg-dark-card-bg p-4 rounded-xl shadow">
        <h2 className="text-base font-semibold mb-2 dark:text-white">📈 Hot Tags</h2>
        <ul className="text-sm text-gray-700 dark:text-dark-muted flex flex-wrap gap-2">
          <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">#AI</span>
          <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">#React</span>
          <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">#Startup</span>
        </ul>
      </div>
    </div>
  );
}
