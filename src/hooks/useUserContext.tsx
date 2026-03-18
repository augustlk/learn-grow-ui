import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  current_streak: number;
  max_streak: number;
  profile_picture?: string | null;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  updateProfilePicture: (base64: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId') || '1';
    const userId = parseInt(storedUserId);

    const mockUsers: Record<number, User> = {
      1: {
        user_id: 1,
        first_name: 'Alice',
        last_name: 'Johnson',
        email: 'alice@example.com',
        current_streak: 5,
        max_streak: 10,
        profile_picture: null,
      },
      2: {
        user_id: 2,
        first_name: 'Bob',
        last_name: 'Smith',
        email: 'bob@example.com',
        current_streak: 2,
        max_streak: 4,
        profile_picture: null,
      },
      3: {
        user_id: 3,
        first_name: 'Charlie',
        last_name: 'Brown',
        email: 'charlie@example.com',
        current_streak: 7,
        max_streak: 12,
        profile_picture: null,
      },
    };

    const userData = mockUsers[userId];
    if (userData) {
      // Fetch profile picture from API
      const apiUrl = import.meta.env.VITE_API_URL || '';
      fetch(`${apiUrl}/api/users/${userId}/profile-picture`)
        .then((r) => r.json())
        .then((data) => {
          setUser({ ...userData, profile_picture: data.data || null });
        })
        .catch(() => {
          setUser(userData);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const updateProfilePicture = (base64: string | null) => {
    if (!user) return;
    setUser({ ...user, profile_picture: base64 });
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser, updateProfilePicture }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};