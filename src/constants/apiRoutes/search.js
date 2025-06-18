export const SEARCH_API = {
  BASE: "/search",
  QUERY: (q) => `/search?query=${encodeURIComponent(q)}`,
};
