'use client';
import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const PSAFile = ({ user }: { user: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isPdf = user.psaUrl.includes('.pdf');
  return (
    <div className='items-center justify-center '>
      <Button onClick={() => setIsOpen(true)} className='text-sm hover:underline text-blue-600'>
        Open
      </Button>

      {/* Dialog to show enlarged image */}
      <Dialog open={isOpen} modal={false} onOpenChange={setIsOpen}>
        <DialogContent className='max-w-xl bg-white w-full py-10 '>
          <DialogHeader>
            <DialogTitle className='flex flex-col space-y-1'>
              <span>PSA file</span>
              <span className='font-medium sm:text-lg text-xs'>Student: <span className=' capitalize sm:text-lg text-xs'>{user.profileId.firstname} {user.profileId.middlename[0] + "."} {user.profileId.lastname}</span></span>
            </DialogTitle>
            <DialogDescription className='hidden'>asdasd</DialogDescription>
          </DialogHeader>
          <div className='overflow-y-auto max-h-[400px] '>
            {isPdf ? <iframe src={user.psaUrl} width='100%' height='400px' className='border-0' title='PDF Preview' /> : <Image src={user.psaUrl} alt={user.profileId.firstname || 'Image'} width={600} priority height={600} className='object-contain' />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PSAFile;
