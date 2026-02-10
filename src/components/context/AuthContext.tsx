import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import instance from "../../confing/AxiosConfig";
import type { UserProfile } from "../types";

type User = any;
type Salon = any;

type AuthContextType = {
  user: User | null;
  salon: Salon | null;
  setUser: (u: User | null) => void;
  isAuthChecked: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [salon, setSalon] = useState<any | null>(null)
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const getMe = async () => {
      try {
        const res = await instance.get("/users/me");
        setUser(res.data.user as UserProfile);
        setSalon(res.data.salon)
      } catch {
        setUser(null);
        setSalon(null)
      } finally {
        setIsAuthChecked(true);
      }
    };

    getMe();
  }, []);

  const handleLogout = async () => {
    try {
      await instance.post("/users/logout");
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setUser(null);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};