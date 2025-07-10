export function Button({ children, onClick, variant = "default", ...props }) {
  const baseStyle = "px-4 py-2 rounded font-medium transition";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 " +
      "dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 " +
      "dark:bg-red-500 dark:hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
