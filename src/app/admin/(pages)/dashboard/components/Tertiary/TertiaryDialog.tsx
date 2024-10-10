'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSemesterData } from '@/constant/enrollment';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { EnrollmentSetupOpenEnrollmentCollegeValidator } from '@/lib/validators/AdminValidator';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { SelectInput } from '../SelectInputs';
import { useUpdateEnrollmentSetupMutation } from '@/lib/queries';

type IProps = {
  isPending: boolean;
  user: any;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export function TertiaryDialog({ isPending, user, setIsOpen }: IProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  // const [isPending, setIsPending] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const mutation = useUpdateEnrollmentSetupMutation();

  const form = useForm<z.infer<typeof EnrollmentSetupOpenEnrollmentCollegeValidator>>({
    resolver: zodResolver(EnrollmentSetupOpenEnrollmentCollegeValidator),
    defaultValues: {
      semester: '',
      schoolYear: 'SY2024-2025',
    },
  });

  const actionFormSubmit = (data: z.infer<typeof EnrollmentSetupOpenEnrollmentCollegeValidator>) => {
    // setIsPending(true);
    setIsOpen(false);
    const dataa = {
      enrollmentTertiary: { open: true, semester: data.semester, schoolYear: data.schoolYear },
    };
    console.log(dataa)
    mutation.mutate(dataa, {
      onSuccess: (res: any) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            makeToastSucess(res.message);
            return;
          default:
            // setIsPending(false);
            makeToastError(res.error);
            return;
        }
      },
      onSettled: () => {
        setIsDialogOpen(false);
      },
    });
  };

  return (
    <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
      <DialogTrigger asChild>
        <Button size={'sm'} className={'w-auto focus-visible:ring-0 flex mb-2 bg-transparent bg-green-500 px-2 py-0 gap-x-1 justify-start text-neutral-50 font-medium tracking-tight'}>
          <Icons.graduationCap className='h-6 w-6' />
          Open/Start Enrollment
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
          </DialogTitle>
          <DialogDescription>To confirm the enrollee, please fill in the required input indicating the type of block assigned to them.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form action='' method='post' className='gap-4 flex flex-col'>
            {loader && (
              <div className=' absolute inset-0 flex justify-center top-0 items-center bg-transparent z-50 select-none'>
                <div className='flex flex-col items-center'>
                  <Image src='/icons/loader.svg' alt='loader' width={48} height={48} priority className='animate-spin' />
                  <p className='mt-4 text-gray-700'>Loading...</p>
                </div>
              </div>
            )}
            <div className='flex flex-col text-sm'>
              <span>
                <span className='text-orange-400'>Format</span>: SY1999-2000
              </span>
            </div>
            <FormField
              control={form.control}
              name={'schoolYear'}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative bg-slate-50 rounded-lg'>
                      <input
                        type={'text'}
                        id={'schoolYear'}
                        className={` uppercase block rounded-xl px-5 pb-2 pt-7 w-full text-sm bg-slate-50 border border-gray-200 appearance-nonefocus:outline-none focus:ring-0 focus:border-gray-400 peer pl-4 align-text-bottom`}
                        onDragStart={(e) => e.preventDefault()}
                        placeholder=''
                        maxLength={11}
                        {...field}
                      />

                      <label
                        htmlFor={'schoolYear'}
                        className='pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5'
                      >
                        {'School year'}
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage className='text-red pl-2' />
                </FormItem>
              )}
            />
            <SelectInput name={'semester'} selectItems={studentSemesterData} form={form} label={'Select Semester:'} placeholder={'Select Semester'} />
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
