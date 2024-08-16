import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  roles: string[];
}

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>("/account");
        setUser({ ...response.data, roles: response.data.roles || [] });
      } catch (error) {
        console.error("Kullanıcı bilgileri alınamadı:", error);
      }
    };

    fetchUser();
  }, []);

  return user;
}
