import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import instance from "../../confing/AxiosConfig";

type User = any;

type AuthContextType = {
  user: User | null;
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
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const getMe = async () => {
      try {
        const res = await instance.get("/users/me");
        setUser(res.data);
      } catch {
        setUser(null);
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
        setUser,
        isAuthChecked,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};