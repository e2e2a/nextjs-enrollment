'use client';
import { useOnlineStatus } from './UseOnlineStatus';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';

export default function StatusIndicator() {
  const { isOffline } = useOnlineStatus();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  return (
    <div>
      
    </div>
  );
}
