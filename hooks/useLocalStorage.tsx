import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize state with initialValue to match server rendering (hydration)
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Read from localStorage after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue((oldValue) => {
        const valueToStore =
          value instanceof Function ? value(oldValue) : value;

        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          } catch (error) {
            console.log(error);
          }
        }
        return valueToStore;
      });
    },
    [key]
  );
  return [storedValue, setValue] as const;
}
