"use client"
import { SiteFooter } from "@/components/shared/Footer";
import { MainNav } from "@/components/shared/MainNav";
import { DashboardNav } from "@/components/shared/nav";
import { UserAccountNav } from "@/components/shared/UserAccountNav";
import { dashboardConfig } from "@/constant/dashboard";
import { getSession, SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from 'react';



const RootLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  // const session = getSession()
  // useEffect(() => {
    
  // }, [])
  // session.then((res) => {
  //   console.log('session',res)
  // })
  const  { data: session, status } = useSession();
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
 
  return (
    <SessionProvider session={session}>
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={dashboardConfig.mainNav} />
          <p>your name{session?.user.firstname}</p>
          {/* <UserAccountNav
            user={{
              firstname: user.firstname,
              image: user.image,
              email: user.email,
            }}
          /> */}
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav items={dashboardConfig.sidebarNav} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
      <SiteFooter className="border-t" />
    </div>
    </SessionProvider>
  );
};

export default RootLayout;