"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Eye, EyeOff, Mail } from "lucide-react";
import { GOOGLE_AUTH_URL } from "@/lib/axios";
import { validateLoginForm, type ValidationErrors } from "@/lib/validation";

function LoginContent() {
  const searchParams = useSearchParams();
  const googleError = searchParams.get("google_error");
  const router = useRouter();
  const { loginFn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (googleError) {
      toast.error("Google login failed. Please try again.");
    }
  }, [googleError]);

  useEffect(() => {
    if (searchParams.get("auth") === "success") {
      router.replace("/");
    }
  }, [searchParams, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateLoginForm({ email, password });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    const success = await loginFn(email, password);
    setLoading(false);
    if (success) router.push("/");
  };

  const handleDemoFill = () => {
    setEmail("demo@cookmate.com");
    setPassword("Demo@123456");
    setErrors({});
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 text-center">
          Welcome Back
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-1">
          Sign in to your CookMate AI account
        </p>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={() => {
            window.location.href = GOOGLE_AUTH_URL;
          }}
          className="btn-premium w-full flex items-center justify-center gap-3 border border-neutral-300 dark:border-neutral-600 rounded-xl px-4 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600 cursor-pointer mt-6"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
          <span className="text-xs text-neutral-400">or</span>
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
          />
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <Button type="submit" isLoading={loading} className="w-full mt-2 cursor-pointer">
            Login
          </Button>
        </form>

        {/* Demo Login */}
        <div className="text-center mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700/60">
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-sm font-medium text-primary-500 hover:underline cursor-pointer"
          >
            Try Demo Account
          </button>
        </div>

        {/* Bottom */}
        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary-500 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}