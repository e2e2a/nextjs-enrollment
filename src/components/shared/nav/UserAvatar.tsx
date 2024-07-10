
import { User } from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage, AvatarProps } from "@radix-ui/react-avatar"

import { Icons } from "../Icons"

interface UserAvatarProps extends AvatarProps {
  user?: Pick<User, "image" | "firstname">
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user?.image ? (
        <AvatarImage alt="Picture" src={user.image} />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.firstname}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  )
}