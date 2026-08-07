import { useEffect, useState } from "react";
export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    // If the value is a string, trim it so spaces are ignored
    const processedValue = (typeof value === 'string' ? value.trimStart() : value) as unknown as T;
    const t = setTimeout(() => setDebounced(processedValue), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}