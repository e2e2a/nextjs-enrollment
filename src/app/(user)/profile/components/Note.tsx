import React from 'react';
import { ChevronsUpDown, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Icons } from '@/components/shared/Icons';
import Link from 'next/link';
interface IProps {
    handleClose: () => void
}
const Note = ({handleClose}: IProps) => {
  return (
    <div className='flex my-3 flex-col relative max-w-[69rem] w-full border border-gray-200 rounded-b-xl pt-16 pb-12 px-11 bg-white rounded-lg space-y-4'>
          <div className='absolute top-9 right-5'>
            <Icons.close className='h-4 w-4 cursor-pointer' onClick={handleClose} />
          </div>
          <div className='flex-col'>
            <h2 className='text-xl font-bold tracking-wide'>Welcome e2e2a</h2>
            <p className='text-muted-foreground text-justify'>
              &nbsp;&nbsp;&nbsp;&nbsp;We’re thrilled to have you join us! To get started, we redirect you to your profile page
              where you can complete your profile details. This will help us tailor our services to your needs and ensure you have
              the best experience possible. If you have any questions or need assistance along the way, don’t hesitate to reach
              out to our{' '}
              <Link href={''} className=' hover:underline text-blue-500 hover:text-blue-600 '>
                support team
              </Link>
              . Welcome aboard!
            </p>
          </div>
          <div className='flex-col'>
            <h2 className='text-lg font-bold tracking-wide text-orange-500'>Note</h2>
            <p className='text-muted-foreground text-justify'>
              &nbsp;&nbsp;&nbsp;&nbsp;To ensure a smooth and complete enrollment process, please be aware that you must fill out
              your profile before proceeding. You won't be able to navigate to other pages or access further enrollment steps
              until your profile is completed. This helps us provide you with the best experience possible and ensures all your
              information is accurately recorded. If you encounter any issues or have questions, our support team is here to help!
            </p>
          </div>
        </div>
    // <Collapsible open={isOpen} onOpenChange={setIsOpen} className='w-full '>
    //   <div className=''>
    //     <CollapsibleTrigger className='w-full border ' asChild>
    //       <Button variant='ghost' size='lg' className='text-left font-bold text-xl w-full bg-white flex justify-between'>
    //         <div className="">Welcome e2e2a</div>
            
    //         <div className="div">
    //         <ChevronsUpDown className="h-4 w-4" />
    //         <span className="sr-only">Toggle</span>
    //         </div>
    //       </Button>
    //     </CollapsibleTrigger>
    //   </div>
    //   <CollapsibleContent className='space-y-2 '>
    //     <div className='rounded-md border font-mono text-sm'>
    //       <div className='rounded-md px-4 py-3 font-mono text-sm'>@stitches/react</div>
    //       <div className='rounded-md px-4 py-3 font-mono text-sm'>@stitches/react</div>
    //     </div>
    //   </CollapsibleContent>
    // </Collapsible>
  );
};

export default Note;
