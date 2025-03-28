// components/MessageListener.js
'use client';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useQueryClient } from '@tanstack/react-query';

const MessageListener = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState([]);
  const queryClient = useQueryClient();
  useEffect(() => {
    const globalChannelName = 'global-channel'; // Define your global channel name
    const channel = supabase.channel(globalChannelName, {
      config: {
        broadcast: { ack: true },
      },
    });

    channel.subscribe((status: any) => {
      if (status === 'SUBSCRIBED') {
        console.log('Subscribed to global channel successfully.');
      }
    });
    channel.on('broadcast', { event: 'invalidate-query' }, (payload: any) => {
      const queryKeys = payload?.payload?.queryKeys;
      if (Array.isArray(queryKeys)) {
        queryKeys.forEach(({ key1, key2 }) => {
          queryClient.invalidateQueries({ queryKey: key2 ? [key1, key2] : [key1] });
        });
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return <div>{children}</div>;
};

export default MessageListener;
