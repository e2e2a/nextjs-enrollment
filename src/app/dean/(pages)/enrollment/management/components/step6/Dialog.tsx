'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { useState } from 'react';

type IProps = {
  isPending: boolean;
  form: any;
  user: any;
  isDialogOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  actionFormSubmit: any;
};

export function DialogStep6Button({ isPending, user, form, isDialogOpen, setIsDialogOpen, setIsOpen, actionFormSubmit }: IProps) {
  const [loader, setLoader] = useState<boolean>(false);

  const options = [{ name: 'Enrolled' }, { name: 'Temporary Enrolled' }];

  return (
    <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
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
        <form method='post' onSubmit={(e) => actionFormSubmit(e, 'Approved')} className='gap-4 flex flex-col'>
          <DialogHeader>
            <DialogTitle className='flex flex-col space-y-1'>
              <span>Complete Current Step</span>{' '}
              <span className='text-sm sm:text-[15px] font-normal'>
                Student Name:{' '}
                <span className='text-sm sm:text-[15px] font-medium capitalize'>
                  {user?.profileId?.firstname ?? ''} {user?.profileId?.lastname ?? ''}
                </span>
              </span>
            </DialogTitle>
            <DialogDescription>&nbsp;&nbsp;&nbsp;&nbsp;To confirm the enrollee status, please fill in the required input indicating the status of the student assigned to them. Please review the information carefully before submitting.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            {loader && (
              <div className=' absolute inset-0 flex justify-center top-0 items-center bg-transparent z-50 select-none'>
                <div className='flex flex-col items-center'>
                  <Image src='/icons/loader.svg' alt='loader' width={48} height={48} priority className='animate-spin' />
                  <p className='mt-4 text-gray-700'>Loading...</p>
                </div>
              </div>
            )}
            <FormField
              control={form.control}
              name={'enrollStatus'}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative bg-slate-50 rounded-lg'>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id={'enrollStatus'} className='w-full pt-10 pb-4 capitalize focus-visible:ring-0 text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'>
                          <SelectValue placeholder={'Select student type'} />
                        </SelectTrigger>
                        <SelectContent className='bg-white border-gray-300 focus-visible:ring-0'>
                          <SelectGroup className='focus-visible:ring-0'>
                            {options.map((item: any, index: any) => (
                              <SelectItem value={item.name} key={index} className='capitalize '>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <label className='pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5'>
                        Student Status
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage className='text-red pl-2' />
                </FormItem>
              )}
            />
          </Form>
          <DialogFooter className='justify-end flex flex-row'>
            <Button type='submit' disabled={isPending} variant='secondary'>
              Submit
            </Button>
            <DialogClose asChild>
              <Button type='button' variant='secondary'>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
