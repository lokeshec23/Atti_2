import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for persistent state using localStorage.
 * Focuses on efficiency, error handling, and correctness.
 *
 * Key fix: `setValue` uses a `latestValueRef` so the callback never captures
 * a stale `storedValue` closure, making rapid functional updates safe.
 *
 * @param {string} key - The key to use in localStorage
 * @param {any} initialValue - The initial value if no value exists in localStorage
 * @returns {[any, function, function]} - [state, setter, remover]
 */
export function useLocalStorage(key, initialValue) {
  // Lazy initializer — reads localStorage only on mount, not every render
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`[useLocalStorage] Error reading key "${key}":`, error);
      return initialValue;
    }
  });

  // Keep a ref in sync so setValue never has a stale closure over storedValue
  const latestValueRef = useRef(storedValue);
  useEffect(() => {
    latestValueRef.current = storedValue;
  }, [storedValue]);

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(latestValueRef.current) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`[useLocalStorage] Error setting key "${key}":`, error);
      }
    },
    [key] // ✅ No storedValue dep — uses ref instead
  );

  /** Completely removes the key from localStorage and resets to initialValue */
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`[useLocalStorage] Error removing key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sync state across multiple browser tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key !== key) return;
      try {
        const next = e.newValue !== null ? JSON.parse(e.newValue) : initialValue;
        setStoredValue(next);
      } catch (error) {
        console.error(`[useLocalStorage] Error syncing key "${key}":`, error);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
