"use client"
import Link from "next/link"
import { getSession, signOut } from "next-auth/react"
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

export function UserAccountNav() {
  const [user, setUser] = useState<IUser | null>(null);

  
  const checkSession = useCallback(async () => {
    try {
      const session = await getSession();
      if (session) {
        if(session.user){
          setUser({
            id: session.user.id!,
            firstname: session.user.firstname!,
            lastname: session.user.lastname!,
            role: session.user.role!,
          });
        }
      } else {
        setUser(null);
       
      }
    } catch (error) {
      console.error('Error fetching session:', error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);
  console.log(user)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        { user && <UserAvatar
          user={{ firstname: user.firstname, image: user.imageUrl || null }}
          className="h-8 w-8"
        />

        }
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user && user.firstname && <p className="font-medium">{user.firstname}</p>}
            {user && user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user!.email}
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
            signOut({
              callbackUrl: `${window.location.origin}/login`,
            })
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}