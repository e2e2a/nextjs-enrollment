"use client";
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';

const Broadcast = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = new BroadcastChannel('my-channel');

    channel.onmessage = (event) => {
        console.log('Received message:', event.data);
        if (event.data.type === 'data-updated') {
          const queryKey = event.data.queryKey;
          if (queryKey) {
            console.log('Invalidating query:', queryKey);
            queryClient.invalidateQueries({ queryKey: [queryKey] });
          }
        }
      };

    return () => {
      channel.close();
    };
  }, [queryClient]);

  return null;
};

export default Broadcast;
