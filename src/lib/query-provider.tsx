'use client';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
type IProps = {
  children: React.ReactNode;
  sessionData: any;
};

export default function Providers({ children, sessionData }: IProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            // staleTime: 1 * 1000,
            // refetchInterval: 2 * 1000,
            // refetchOnWindowFocus: false,
          },
        }
      }),
  );

  return (
    <SessionProvider session={sessionData} refetchOnWindowFocus={false} refetchWhenOffline={false}>
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}
