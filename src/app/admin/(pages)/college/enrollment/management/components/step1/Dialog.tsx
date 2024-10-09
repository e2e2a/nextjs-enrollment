'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { selectType } from '@/constant/enrollment';
import { useApprovedEnrollmentStep1Mutation, useBlockCourseQuery, useSchoolYearQuery } from '@/lib/queries';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { EnrollmentBlockTypeValidator } from '@/lib/validators/AdminValidator';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';

type IProps = {
  isPending: boolean;
  user: any;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export function DialogStep1Button({ isPending, user, setIsOpen }: IProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [blocks, setBlocks] = useState<any>([]);
  const [blockDisable, setBlockDisable] = useState<boolean>(false);

  const { data: bData, isLoading: bLoading, isError: bError } = useBlockCourseQuery();
  const mutation = useApprovedEnrollmentStep1Mutation();

  const form = useForm<z.infer<typeof EnrollmentBlockTypeValidator>>({
    resolver: zodResolver(EnrollmentBlockTypeValidator),
    defaultValues: {
      studentType: '',
      blockType: '',
    },
  });

  useEffect(() => {
    if (!bData || bError) return;

    if (bData) {
      if (bData.blockTypes) {
        const filteredBlocks = bData.blockTypes.filter((block) => block.courseId._id === user.courseId._id && block.semester === user.studentSemester && block.year === user.studentYear);
        setBlocks(filteredBlocks);
        setLoader(false);
      }
      return;
    }
  }, [bData, bError, bLoading, user]);
  const actionFormSubmit = (data: z.infer<typeof EnrollmentBlockTypeValidator>) => {
    // setIsPending(true);
    setIsOpen(false);
    const dataa = {
      EId: user._id,
      ...data,
    };
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
  useEffect(() => {
    const subscription = form.watch((e) => {
      if (e.studentType !== 'regular') {
        if (form.getValues('blockType') !== '') {
          form.setValue('blockType', ''); // Reset blockType only if necessary
        }
        setBlockDisable(true);
      } else {
        setBlockDisable(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [form,blockDisable]);
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
          <form action='' method='post' className='gap-4 flex flex-col'>
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
              name={'studentType'}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative bg-slate-50 rounded-lg'>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id={'studentType'} className='w-full pt-10 pb-4 capitalize focus-visible:ring-0 text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'>
                          <SelectValue placeholder={'Select student type'} />
                        </SelectTrigger>
                        <SelectContent className='bg-white border-gray-300 focus-visible:ring-0'>
                          <SelectGroup className='focus-visible:ring-0'>
                            {selectType.studentType.map((item: any, index: any) => (
                              <SelectItem value={item.value} key={index} className='capitalize '>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <label
                        className='pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5'
                      >
                        {'Student Type'}
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage className='text-red pl-2' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={'blockType'}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative bg-slate-50 rounded-lg'>
                      <Select onValueChange={field.onChange} value={field.value} disabled={blockDisable} >
                        <SelectTrigger id={'blockType'} className='w-full pt-10 pb-4 capitalize focus-visible:ring-0 text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'>
                          <SelectValue placeholder={'Select student type'} />
                        </SelectTrigger>
                        <SelectContent className='bg-white border-gray-300 focus-visible:ring-0'>
                          <SelectGroup className='focus-visible:ring-0'>
                            {blocks.length > 0 ? (
                              blocks.map((item: any, index: any) => (
                                <SelectItem value={item._id} key={index} className='capitalize'>
                                  Block {item.section}
                                </SelectItem>
                              ))
                            ) : (
                              <div className='text-xs text-red'>No Blocks for the student associated with year,semester and course.</div>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <label
                        className='pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5'
                      >
                        {'Block type'}
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage className='text-red pl-2' />
                </FormItem>
              )}
            />
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
