import { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export default function Input({
  label,
  error,
  icon,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">{icon}</span>}
        <input
          className={`input-premium w-full rounded-xl border px-4 py-2.5 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 outline-none bg-white dark:bg-neutral-800 ${
            icon ? "pl-10" : ""
          } ${
            error
              ? "border-red-500"
              : "border-neutral-300 dark:border-neutral-600"
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}