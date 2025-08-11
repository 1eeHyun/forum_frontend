// Small helper to build query strings safely
const toQuery = (params = {}) => {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (entries.length === 0) return "";
  const qs = new URLSearchParams();
  for (const [k, v] of entries) {
    // Support numbers, strings, booleans
    qs.append(k, String(v));
  }
  return `?${qs.toString()}`;
};

export const REPORTS = {
  // POST /api/reports
  CREATE: { method: "POST", url: "/reports" },

  // GET /api/reports/me?page=0&size=20&sort=createdAt,desc
  MY: (params = {}) => ({
    method: "GET",
    url: `/reports/me${toQuery(params)}`,
  }),

  // GET /reports/queue?status=PENDING&communityId=1&page=0&size=20
  QUEUE: (params = {}) => ({
    method: "GET",
    url: `/reports/queue${toQuery(params)}`,
  }),

  // POST /reports/{id}/attachments
  ADD_ATTACHMENTS: (id) => ({
    method: "POST",
    url: `/reports/${id}/attachments`,
  }),

  // POST /reports/{id}/action
  TAKE_ACTION: (id) => ({
    method: "POST",
    url: `/reports/${id}/action`,
  }),

  // POST /reports/{id}/reject?note=...
  REJECT: (id, note) => ({
    method: "POST",
    url: `/reports/${id}/reject${toQuery({ note })}`,
  }),
};

// (Optional) Common Pageable defaults you can reuse when calling MY/QUEUE
export const DEFAULT_PAGEABLE = { page: 0, size: 20, sort: "createdAt,desc" };
