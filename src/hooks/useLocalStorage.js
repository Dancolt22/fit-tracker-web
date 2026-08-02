import { useState, useEffect } from 'react';

/**
 * A custom React hook to persist state changes in localStorage.
 * Useful for real-world projects that need state retention across reloads.
 */
export default function useLocalStorage(key, initialValue) {
  // Pass initial state function to useState so logic only runs once
  const [value, setValue] = useState(() => {
    try {
      const jsonValue = localStorage.getItem(key);
      if (jsonValue != null) return JSON.parse(jsonValue);

      if (typeof initialValue === 'function') {
        return initialValue();
      } else {
        return initialValue;
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
