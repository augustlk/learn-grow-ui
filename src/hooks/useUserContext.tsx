import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiFetch } from "@/lib/api";

interface User {
  user_id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  current_streak?: number;
  profile_picture?: string | null;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userId: number) => void;
  logout: () => void;
  updateProfilePicture: (base64: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Load user on app start
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    apiFetch("/auth/me")
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔐 Login handler
  const login = (token: string, userId: number) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId.toString());

    // fetch fresh user
    apiFetch("/auth/me").then((data) => {
      setUser(data.user);
    });
  };

  // 🔓 Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
    window.location.href = "/auth";
  };

  const updateProfilePicture = (base64: string | null) => {
    if (!user) return;
    setUser({ ...user, profile_picture: base64 });
  };

  return (
    <UserContext.Provider
      value={{ user, loading, login, logout, updateProfilePicture }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};