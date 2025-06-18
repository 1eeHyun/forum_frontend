import axios from "@/api/axios";

export const apiRequest = async ({ method, url, data, params }) => {
  try {
    const response = await axios({ method, url, data, params });
    return response.data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};
