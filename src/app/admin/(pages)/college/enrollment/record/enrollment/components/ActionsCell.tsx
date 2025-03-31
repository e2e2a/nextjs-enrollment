import React from 'react';
import { Icons } from '@/components/shared/Icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
// import { DialogStep1Button } from './Dialog';
type IProps = {
  user: any;
};
const ActionsCell = ({ user }: IProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);

  return (
    <div className='w-full flex items-center justify-center'>
      <Button disabled={isPending} type='button' size={'sm'} className={'w-auto group focus-visible:ring-0 flex mb-2 bg-transparent bg-blue-600 px-2 py-0 gap-x-1 justify-start items-center text-neutral-50 font-medium'}>
        <Link href={`/admin/college/enrollment/record/enrollment/${user?._id}`} className='flex flex-row items-center gap-x-1 pr-1 tracking-wide font-medium'>
          <Icons.eye className='h-4 w-4' />
          View{' '}
        </Link>
      </Button>
    </div>
  );
};

export default ActionsCell;
