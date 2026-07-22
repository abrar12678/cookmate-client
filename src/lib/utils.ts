/* ──────────────────────────────────────────────
   CookMate AI — Helper Utilities
   Deduplicated helper functions & error handling
   ────────────────────────────────────────────── */

/**
 * Safely extracts error message from API response or Error object
 */
export function getErrorMessage(error: unknown, fallback = "An unexpected error occurred"): string {
  if (!error) return fallback;

  if (typeof error === "string") return error;

  const errObj = error as {
    response?: {
      data?: {
        message?: string;
        error?: string;
      };
    };
    message?: string;
  };

  return (
    errObj.response?.data?.message ||
    errObj.response?.data?.error ||
    errObj.message ||
    fallback
  );
}

/**
 * Formats date string into readable format (e.g. "Oct 12, 2024")
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Utility to combine multiple CSS class names
 */
export function cn(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(" ");
}
