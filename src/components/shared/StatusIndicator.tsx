'use client';
import { useOnlineStatus } from './UseOnlineStatus';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '../ui/button';
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
      {isOffline && (
        <div>
          <Dialog open={true} modal={true}>
            <DialogContent className='fixed flex items-center justify-center bg-white' onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
              {/* Hide close button */}
              <style>{`
        [data-state="open"] > button.absolute {
          display: none !important;
        }
      `}</style>

              <div className='max-w-sm text-center'>
                <DialogHeader>
                  <DialogTitle className='text-xl font-semibold text-red-500'>You are currently offline</DialogTitle>
                </DialogHeader>
                <div className='mt-4'>
                  <Link href={currentUrl} className='px-4 py-2 bg-blue-500 text-white rounded-md'>
                    Refresh Page
                  </Link>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
