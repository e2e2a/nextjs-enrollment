'use client';
import { useEffect } from 'react';
import LogRocket from 'logrocket';

type IProps = { children: React.ReactNode };

export default function LogRocketProvider({ children }: IProps) {
  useEffect(() => {
    // Initialize LogRocket with your app ID
    LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID!); // Replace 'your-app-id' with your actual LogRocket App ID
  }, []);

  return children;
}
