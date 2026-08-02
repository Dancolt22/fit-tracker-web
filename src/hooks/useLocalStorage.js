import { useState, useEffect } from 'react';

/**
 * A custom React hook to persist state changes in local storage
 * Useful for real world projects that need state retention across reloads
 */
export default function useLocalStorage(key, initialValue) {
  // Retrieve saved value or set the default value
  const [value, setValue] = useState(() => {
    try {
      const jsonValue = localStorage.getItem(key);
      // Return parsed data if it exists in local storage
      if (jsonValue != null) return JSON.parse(jsonValue);

      // Execute function if initial value is a callback
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

  // Sync state changes back to local storage whenever key or value updates
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
