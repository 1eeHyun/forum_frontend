import { useEffect } from "react";
import axios from "@/api/axios";

export default function PingOnlineStatus() {
  useEffect(() => {
    const interval = setInterval(() => {
      axios.post("/users/ping").catch((err) => {
        console.warn("Ping failed", err);
      });
    }, 60000); // 60seconds

    return () => clearInterval(interval);
  }, []);

  return null;
}
