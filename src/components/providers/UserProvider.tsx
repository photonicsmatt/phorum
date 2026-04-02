"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface UserState {
  id: string;
  username: string;
  displayName: string;
}

const UserContext = createContext<{
  user: UserState | null;
  setUser: (user: UserState | null) => void;
  login: (username: string) => Promise<UserState>;
  logout: () => void;
}>({
  user: null,
  setUser: () => {},
  login: async () => ({ id: "", username: "", displayName: "" }),
  logout: () => {},
});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserState | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("phorum-user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("phorum-user");
      }
    }
  }, []);

  const login = useCallback(async (username: string): Promise<UserState> => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    const userState: UserState = {
      id: data.id,
      username: data.username,
      displayName: data.displayName,
    };
    setUser(userState);
    localStorage.setItem("phorum-user", JSON.stringify(userState));
    return userState;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("phorum-user");
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
