import { useEffect, useState } from "react";
import axios from "@/api/axios";
import { PROFILE, AUTH } from "@/constants/apiRoutes";

export default function useFetchUsers(search) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let currentUser = null;

    const fetch = async () => {
      try {
        const {
          data: { data: me },
        } = await axios(AUTH.ME);
        currentUser = me;

        let result = [];

        if (search.trim() === "") {
          const { method, url } = PROFILE.GET(me.username);
          const res = await axios({ method, url });
          result = res.data.data.followings || [];
        } else {
          const res = await axios.get(`/search/users?keyword=${encodeURIComponent(search)}`);
          result = res.data.data || [];
        }

        const filtered = result.filter((user) => user.username !== currentUser.username);
        setUsers(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    const delay = setTimeout(fetch, 300);
    return () => clearTimeout(delay);
  }, [search]);

  return users;
}
