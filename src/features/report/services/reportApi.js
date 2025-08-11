import axios from "@/api/axios";
import { REPORTS } from "@/constants/apiRoutes/reports";

// Create report
export const createReport = async (payload) => {
  // payload: { targetType, targetId, reason, detail, attachmentUrls? }
  const { method, url } = REPORTS.CREATE;
  return axios({ method, url, data: payload });
};
