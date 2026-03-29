import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { apiFetch } from "@/lib/api";

interface User {
  user_id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  current_streak?: number;
  max_streak?: number;
  profile_picture?: string | null;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userId: number) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfilePicture: (base64: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch("/auth/me");
      if (data?.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (token: string, userId: number) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId.toString());
    await refreshUser();
  }, [refreshUser]);

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
      value={{ user, loading, login, logout, refreshUser, updateProfilePicture }}
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