import { Avatar, AvatarFallback, AvatarImage, AvatarProps } from '@radix-ui/react-avatar';

import { Icons } from '../Icons';
interface UserAvatarProps extends AvatarProps {
  // user?: Pick<User, "image" | "firstname">
  session?: any;
}

export function UserAvatar({ session, ...props }: UserAvatarProps) {
  let image = '';
  console.log('session?.firstname', session?.firstname);
  return (
    <Avatar {...props}>
      {image ? (
        <AvatarImage className='w-9 h-9 rounded-full' alt='Picture' src={session.imageUrl} />
      ) : (
        <AvatarImage className='w-9 h-9 rounded-full' alt='Picture' src={'/icons/profile-placeholder.svg'} />
      )}
    </Avatar>
  );
}
