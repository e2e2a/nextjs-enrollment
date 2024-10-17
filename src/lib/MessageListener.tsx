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
    channel.on('broadcast', { event: 'message' }, (payload: any) => {
      console.log('Received message:', payload);
      const messages = payload?.payload?.message;
      messages.map((item: any) => {
        if (item?.queryKey) {
          // Invalidate queries based on the queryKey from each message
          queryClient.invalidateQueries({ queryKey: [item.querKey] });
        }
      });
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return <div>{children}</div>;
};

export default MessageListener;
