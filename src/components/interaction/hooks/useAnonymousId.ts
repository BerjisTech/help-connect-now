
import { useState, useEffect } from 'react';

export const useAnonymousId = () => {
  const [anonymousId, setAnonymousId] = useState<string | null>(null);

  // Initialize anonymous ID on mount
  useEffect(() => {
    const storedId = localStorage.getItem('anonymousId');
    if (storedId) {
      setAnonymousId(storedId);
    } else {
      const newId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('anonymousId', newId);
      setAnonymousId(newId);
    }
  }, []);

  return { anonymousId };
};
