import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variantClasses: Record<string, string> = {
  primary: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700",
  secondary: "bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700",
  outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 active:bg-primary-100 dark:active:bg-primary-500/20",
  ghost: "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:bg-neutral-200 dark:active:bg-neutral-700",
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`btn-premium cursor-pointer inline-flex items-center justify-center rounded-xl font-medium disabled:opacity-60 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : (
        children
      )}
    </button>
  );
}