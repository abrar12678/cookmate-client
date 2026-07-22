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
import { getErrorMessage } from "@/lib/utils";
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
    const token = localStorage.getItem("token");
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
      return;
    }
    // Validate token with server
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.data.user);
      })
      .catch(() => {
        // Token invalid or expired — clear it
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const loginFn = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { user: userData, token } = res.data.data;
      if (token) localStorage.setItem("token", token);
      setUser(userData);
      toast.success("Logged in successfully!");
      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Login failed"));
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
      const { user: userData, token } = res.data.data;
      if (token) localStorage.setItem("token", token);
      setUser(userData);
      toast.success("Account created successfully!");
      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Registration failed"));
      return false;
    }
  };

  const logoutFn = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Even if the API call fails, clear local state
    }
    localStorage.removeItem("token");
    setUser(null);
    toast.info("Logged out");
    router.push("/");
  };

  const __triggerRefresh = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginFn,
        registerFn,
        logoutFn,
        __triggerRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
