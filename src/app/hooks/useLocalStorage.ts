import { useState, useEffect } from "react";

const useLocalStorage = (key: string, initialValue: any) => {
  const [state, setState] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : initialValue;
      } catch (error) {
        return initialValue;
      }
    }
    return initialValue;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const value = window.localStorage.getItem(key);
        if (value) {
          setState(JSON.parse(value));
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [key]);

  const setValue = (value: any) => {
    if (typeof window !== "undefined") {
      try {
        const valueToStore = value instanceof Function ? value(state) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        setState(value);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return [state, setValue];
};

export default useLocalStorage;
