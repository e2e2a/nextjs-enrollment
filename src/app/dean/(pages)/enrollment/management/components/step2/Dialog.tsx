import { Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { selectType } from '@/constant/enrollment';
import { useApprovedEnrollmentStep1Mutation, useApprovedEnrollmentStep2Mutation, useBlockCourseQuery } from '@/lib/queries';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { SelectInput } from './SelectInput';
import { EnrollmentBlockTypeValidator } from '@/lib/validators/AdminValidator';

type IProps = {
  isPending: boolean;
  user: any;
};
export function DialogStep1Button({ isPending, user}: IProps) {
  const [loader, setLoader] = useState<boolean>(false);
  const mutation = useApprovedEnrollmentStep2Mutation();
  const form = useForm<z.infer<typeof EnrollmentBlockTypeValidator>>({
    resolver: zodResolver(EnrollmentBlockTypeValidator),
    defaultValues: {
      blockType: '',
    },
  });
  const actionFormSubmit = () => {
    // setIsPending(true);
    const dataa = {
      EId: user._id,
    };
    mutation.mutate(dataa, {
      onSuccess: (res) => {
        console.log(res);
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            // setTypeMessage('success');
            // setMessage(res?.message);
            // return (window.location.href = '/');
            console.log(res);
            return;
          default:
            //create maketoast
            // setIsPending(false);
            // setMessage(res.error);
            // setTypeMessage('error');
            return;
        }
      },
      onSettled: () => {},
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'sm'} className={'w-full focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-green-500 px-2 py-0 gap-x-1 justify-start hover:text-neutral-50 font-medium'}>
          <Icons.check className='h-4 w-4' />
          Complete Current Step
        </Button>
      </DialogTrigger>
      <DialogContent
        className='sm:max-w-md w-full bg-white focus-visible:ring-0 '
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className='flex flex-col space-y-1'>
            <span>Complete Current Step</span>{' '}
            <span className='text-sm sm:text-[15px] font-normal'>
              Student Name:{' '}
              <span className='text-sm sm:text-[15px] font-medium capitalize'>
                {user.profileId.firstname} {user.profileId.lastname}
              </span>
            </span>
          </DialogTitle>
          <DialogDescription>To confirm the enrollee, please fill in the required input indicating the type of block assigned to them.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form action='' method='post'>
            {loader && (
              <div className=' absolute inset-0 flex justify-center top-0 items-center bg-transparent z-50 select-none'>
                <div className='flex flex-col items-center'>
                  <Image src='/icons/loader.svg' alt='loader' width={48} height={48} priority className='animate-spin' />
                  <p className='mt-4 text-gray-700'>Loading...</p>
                </div>
              </div>
            )}
            <SelectInput name={'semester'} selectItems={selectType.studentType} form={form} label={'Select Block Semester:'} placeholder={'Select block semester'} />
          </form>
        </Form>
        <DialogFooter className='justify-end flex flex-row'>
          <Button type='submit' onClick={form.handleSubmit(actionFormSubmit)} variant='secondary'>
            Submit
          </Button>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
