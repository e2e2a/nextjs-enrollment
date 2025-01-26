'use client';
import { useEffect } from 'react';
import { SessionProvider, signOut } from 'next-auth/react';
import { useSignOutMutation } from './queries/auth/signOut';
import { makeToastError } from './toast/makeToast';
import { useLoading } from '@/components/shared/nav/logout/LoadingContext';

type IProps = {
  children: React.ReactNode;
  session: any;
};

export default function NextAuthProvider({ children, session }: IProps) {
  console.log('sessions:', session);
  const mutation = useSignOutMutation();
  const { setLoading } = useLoading();
  useEffect(() => {
    // const currentTime = Math.floor(Date.now() / 1000);
    // const expirationTime = session?.expires / 1000;

    // Check if the token is expired
    if (session && session.expires) {
      if (!session?.user?.role || !session?.user?.id || !session?.user?.email || !session?.user?.name) {
        setLoading(true);
        const dataa = {
          userId: session?.user?.id,
        };
        mutation.mutate(dataa, {
          onSuccess: async(res: any) => {
            switch (res.status) {
              case 200:
              case 201:
              case 203:
                await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL, redirect: true });
                localStorage.clear();
                sessionStorage.clear();
                return;
              default:
                setLoading(false);
                makeToastError(res.error);
                return;
            }
          },
          onSettled: () => {},
        });
      }
    }
  }, [session]);
  return <div className=''>{children}</div>;
}
