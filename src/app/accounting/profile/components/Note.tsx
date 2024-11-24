import React from 'react';
import { ChevronsUpDown, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Icons } from '@/components/shared/Icons';
import Link from 'next/link';
interface IProps {
  profile: any;
  handleClose: () => void;
}
const Note = ({ profile, handleClose }: IProps) => {
  return (
    // <div className='flex drop-shadow-md shadow-md shadow-orange-200 my-3 flex-col relative max-w-[69rem] w-full border border-gray-40 rounded-b-xl pt-16 pb-12 px-11 bg-white rounded-lg space-y-4'>
    <div className='flex drop-shadow-none shadow-md shadow-orange-200 my-3 flex-col relative max-w-[69rem] w-full border border-gray-40 rounded-xl pt-5 pb-12 px-11 bg-white space-y-4'>
      <div className='absolute top-9 right-5'>
        <Icons.close className='h-4 w-4 cursor-pointer' onClick={handleClose} />
      </div>
      <div className='flex justify-start items-center'>
        <h2 className='text-xl font-bold tracking-wide'>Welcome {profile.username}</h2>
      </div>
      <div className='flex-col'>
        <p className='text-muted-foreground text-justify text-sm sm:text-[15px]'>
          &nbsp;&nbsp;&nbsp;&nbsp;We’re excited to have you on board and ready to share your expertise. To begin, we’ll guide you to your profile page where you can complete your details. This will allow us to better support you and help you make the most of
          your teaching experience. Should you have any questions or need help at any point, feel free to contact our
          <Link href={''} className=' hover:underline text-blue-500 hover:text-blue-600 '>
            support team
          </Link>
          . We look forward to working with you!
        </p>
      </div>
    </div>
  );
};

export default Note;
