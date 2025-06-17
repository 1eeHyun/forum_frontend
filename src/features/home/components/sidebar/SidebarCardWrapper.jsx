export default function SidebarCardWrapper({ title, children, action }) {
  return (
    <div className="bg-home-sidebar-bg dark:bg-dark-home-sidebar-bg rounded-2xl shadow-md overflow-hidden border border-card dark:border-dark-card">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-card dark:border-dark-card text-sm text-muted dark:text-dark-muted">
        <span className="font-semibold tracking-tight">{title}</span>
        {action}
      </div>

      {/* Body */}
      <div className="p-2 space-y-2 max-h-[60vh] overflow-y-auto pr-1">
        {children}
      </div>
    </div>
  );
}
