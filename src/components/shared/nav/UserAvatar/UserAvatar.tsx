import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Avatar, AvatarFallback, AvatarImage, AvatarProps } from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';
interface UserAvatarProps {
  // user?: Pick<User, "image" | "firstname">
  session?: any;
  className?: string;
}
// interface UserAvatarProps extends AvatarProps {
//   // user?: Pick<User, "image" | "firstname">
//   session?: any;
// }

export function UserAvatar({ session, className, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props} className='w-full h-full '>
      {session.imageUrl ? (
        <div>
          <AvatarImage className={cn('rounded-full', className)} alt='Picture' src={session.imageUrl} onDragStart={(e) => e.preventDefault()}/>
          <AvatarFallback className={cn('rounded-full bg-gray-300 bg-opacity-50 flex items-center justify-center', className)} />
        </div>
      ) : (
        <div>
          <AvatarImage className={cn('rounded-full', className)} alt='Picture' src={'/icons/profile-placeholder.svg'} onDragStart={(e) => e.preventDefault()}/>
          <AvatarFallback className={cn('rounded-full bg-gray-300 bg-opacity-50 flex items-center justify-center', className)} />
        </div>
      )}
    </Avatar>
  );
}
