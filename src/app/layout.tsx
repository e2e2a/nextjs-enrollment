import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from '@/lib/query-provider';
import { auth } from '@/auth';
import MessageListener from '@/lib/MessageListener';
import { LoadingProvider } from '@/components/shared/nav/logout/LoadingContext';
import Warning from '@/components/shared/Warning';
import MaintenancePage from './maintenance/page';
import LogRocketProvider from '@/components/providers/LogRocketProvider';
const inter = Inter({ subsets: ['latin'], display: 'swap', preload: false });

export const metadata: Metadata = {
  title: 'Dipolog City Institute of Technology, INC.',
  description: 'Welcome, Your trusted enrollment management system for Dipolog City Institute of Technology. Sign in to explore and manage your academic journey!',
  keywords: 'Dipolog City, dipolog city institute of technology, Enrollment, DCIT, DCIT.INC, Enroll DCIT, Enrollment Management System, Technology',
  icons: {
    icon: '/favicon-48x48.png', // Point to your 48x48 favicon
    shortcut: '/favicon.ico',
    apple: '/favicon-48x48.png', // For Apple devices
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  console.log('session', session);
  return (
    <html lang='en' className='' suppressHydrationWarning>
      {/* <body className={`custom-scrollbar-body ${inter.className}`} > */}
      <body className={inter.className}>
        <div className=''>
          <LogRocketProvider>
            <Warning />
            <MaintenancePage>
              <LoadingProvider>
                <Providers session={session}>
                  {/* <MessageListener> */}
                  {children}
                  <Toaster position='top-center' reverseOrder={false} />
                  {/* </MessageListener> */}
                </Providers>
              </LoadingProvider>
            </MaintenancePage>
          </LogRocketProvider>
        </div>
      </body>
    </html>
  );
}
