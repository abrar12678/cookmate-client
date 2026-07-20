"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginFn: (email: string, password: string) => Promise<boolean>;
  registerFn: (
    name: string,
    email: string,
    password: string,
  ) => Promise<boolean>;
  logoutFn: () => void;
  __triggerRefresh: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Token is now in an httpOnly cookie — just check /auth/me
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.data.user);
      })
      .catch(() => {
        // Not authenticated — that's fine
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const loginFn = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post("/auth/login", { email, password });
      // Server sets httpOnly cookie — no localStorage needed
      const { user: userData } = res.data.data;
      setUser(userData);
      toast.success("Logged in successfully!");
      return true;
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Login failed";
      toast.error(msg);
      return false;
    }
  };

  const registerFn = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const res = await api.post("/auth/register", { name, email, password });
      // Server sets httpOnly cookie — no localStorage needed
      const { user: userData } = res.data.data;
      setUser(userData);
      toast.success("Account created successfully!");
      return true;
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Registration failed";
      toast.error(msg);
      return false;
    }
  };

  const logoutFn = async () => {
    try {
      // Tell server to clear the httpOnly cookie
      await api.post("/auth/logout");
    } catch {
      // Even if the API call fails, clear local state
    }
    setUser(null);
    toast.info("Logged out");
    router.push("/");
  };

  const __triggerRefresh = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, loginFn, registerFn, logoutFn, __triggerRefresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}