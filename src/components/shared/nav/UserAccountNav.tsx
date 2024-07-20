"use client"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "./UserAvatar"
import { useCallback, useEffect, useState } from "react"
import { IUser } from "@/types"

export function UserAccountNav({session}: any) {
  // console.log('this is session', session.user)
  // const [user, setUser] = useState<IUser | null>(null);

  // const checkSession = useCallback(async () => {
  //   try {
  //     // const session = await getSession();
  //     if (session) {
  //       // if(session.user){
  //         setUser({
  //           id: session.id!,
  //           firstname: session.firstname!,
  //           lastname: session.lastname!,
  //           role: session.role!,
  //           // id: session.user.id!,
  //           // firstname: session.user.firstname!,
  //           // lastname: session.user.lastname!,
  //           // role: session.user.role!,
  //         });
  //       // }
  //     } else {
  //       setUser(null);
       
  //     }
  //   } catch (error) {
  //     setUser(null);
  //   }
  // }, []);

  // useEffect(() => {
  //   checkSession();
  // }, [checkSession]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        { session && <UserAvatar
          session={{ firstname: session.firstname, imageUrl: session.imageUrl, asd: ''|| null }}
          className="h-8 w-8"
        />

        }
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {session && session.firstname && <p className="font-medium">{session.firstname}</p>}
            {session && session.email && (
              <p className="w-full mr-3 truncate text-sm text-muted-foreground">
                {session!.email}
              </p>
            )}
            
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/billing">Billing</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault()
            // signOut({
            //   callbackUrl: `${window.location.origin}/login`,
            // })
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}