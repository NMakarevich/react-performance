import { useEffect, useState } from 'react';

export function useLocalStorage(key: string, initialValue: string = '') {
  const [ls, setLs] = useState<string>(getFromLocalStorage);

  function getFromLocalStorage() {
    return localStorage.getItem(key) || initialValue;
  }

  useEffect(() => {
    localStorage.setItem(key, ls);
  }, [key, ls]);

  return [ls, setLs] as const;
}
