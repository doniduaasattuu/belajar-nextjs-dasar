type User = {
  username: string;
  name: string;
};

import { useState, useEffect } from "react";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    }
  }, []);

  return user;
}
