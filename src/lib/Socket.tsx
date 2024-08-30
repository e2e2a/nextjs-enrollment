'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

export const socket = io('https://nextjs-enrollment.vercel.app', {
  path: '/socket.io', // Same path as server configuration
  transports: ['websocket', 'polling'],
});




export const SocketProvier = ({children}: {children: React.ReactNode}) => {
  const queryClient = useQueryClient(); 
  
  useEffect(() => {
    // Listen for the refresh-data event
    socket.on('refresh-data', (data) => {
      console.log('Received refresh-data:1111', data);
      queryClient.invalidateQueries({ queryKey: [data.key] });
    });
  }, [queryClient]);
  // useEffect(() => {
  //   // Event handler for receiving refresh-data
  //   const handleRefreshData = (data: { key: string }) => {
  //     console.log('Received refresh-data:', data);
  //     queryClient.invalidateQueries({ queryKey: [data.key] });
  //   };

  //   // Register the event listener
  //   socket.on('refresh-data', handleRefreshData);

  //   // Cleanup event listener on unmount
  //   return () => {
  //     socket.off('refresh-data', handleRefreshData);
  //   };
  // }, [queryClient]);
  return <div>{children}</div>
}