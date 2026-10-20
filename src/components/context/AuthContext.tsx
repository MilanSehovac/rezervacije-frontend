import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import instance from "../../confing/AxiosConfig";
import type { SalonProfile, UserProfile } from "../types";

type User = UserProfile;
// /users/me returns the salon row only (no services or team)
type Salon = Pick<SalonProfile, "id" | "businessName"> & Partial<SalonProfile>;

type AuthContextType = {
  user: User | null;
  salon: Salon | null;
  setUser: (u: User | null) => void;
  isAuthChecked: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [salon, setSalon] = useState<Salon | null>(null)
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const refreshSession = useCallback(async () => {
    try {
      const res = await instance.get("/users/me");
      setUser(res.data.user as UserProfile);
      setSalon(res.data.salon);
    } catch {
      setUser(null);
      setSalon(null);
    }
  }, []);

  useEffect(() => {
    const getMe = async () => {
      await refreshSession();
      setIsAuthChecked(true);
    };

    getMe();
  }, [refreshSession]);

  const handleLogout = async () => {
    try {
      await instance.post("/users/logout");
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setUser(null);
      setSalon(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        salon,
        setUser,
        isAuthChecked,
        logout: handleLogout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};