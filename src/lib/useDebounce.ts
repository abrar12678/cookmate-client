"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to debounce values (e.g. search inputs)
 * @param value The value to debounce
 * @param delay Delay in milliseconds (default: 400ms)
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
