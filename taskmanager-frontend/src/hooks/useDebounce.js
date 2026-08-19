import { useEffect, useRef } from 'react';

/**
 * Debounce a value by the given delay (ms).
 * Returns the debounced value.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = [value, null];
  // Use a ref to avoid re-renders from useState
  const ref = useRef(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current = value;
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return ref.current;
}

import { useState } from 'react';

/** Debounce hook using useState (preferred for reactive use) */
export function useDebounceValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}
