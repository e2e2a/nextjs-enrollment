import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from '@/lib/query-provider';
import { auth } from '@/auth';
import MessageListener from '@/lib/MessageListener';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dipolog City Institute of Technology, INC.',
  description: 'Generated by create next app',
  icons: {
    icon: "/favicon-32x32.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const sessionData = await auth();
  console.log('sessionData', sessionData);
  return (
    <html lang='en' className='' suppressHydrationWarning>
      {/* <body className={`custom-scrollbar-body ${inter.className}`} > */}
      <body className={inter.className}>
        <Providers sessionData={sessionData}>
          {/* <MessageListener> */}
          {children}
          <Toaster position='top-center' reverseOrder={false} />
          {/* </MessageListener> */}
        </Providers>
      </body>
    </html>
  );
}
