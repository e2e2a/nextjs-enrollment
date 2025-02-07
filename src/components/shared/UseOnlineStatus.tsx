'use client';
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Ensure we're running in the browser
    if (typeof window !== 'undefined') {
      const updateStatus = () => setIsOffline(!navigator.onLine);

      // Initial check
      setIsOffline(!navigator.onLine);

      window.addEventListener('online', updateStatus);
      window.addEventListener('offline', updateStatus);

      return () => {
        window.removeEventListener('online', updateStatus);
        window.removeEventListener('offline', updateStatus);
      };
    }
  }, []);

  return { isOffline };
}
