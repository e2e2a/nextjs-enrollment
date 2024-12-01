'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { SelectInput } from './SelectInputs';
import { DownPaymentValidator } from '@/lib/validators/downPayment/create';
import { useCourseQueryByCategory } from '@/lib/queries/courses/get/category';
import { Loader } from 'lucide-react';
import { useCreateDownPaymentMutation } from '@/lib/queries/downPayment/create';

type IProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function CreateDialog({ setIsOpen }: IProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const { data: cData, isLoading, error } = useCourseQueryByCategory('College');

  useEffect(() => {
    if (error || !cData) return;
    if (cData) {
      if (cData.courses) {
        setIsPageLoading(false);
        return;
      }
    }
  }, [cData, error]);
  const mutation = useCreateDownPaymentMutation();

  const form = useForm<z.infer<typeof DownPaymentValidator>>({
    resolver: zodResolver(DownPaymentValidator),
    defaultValues: { courseCode: '', defaultPayment: `0.00` },
  });

  const actionFormSubmit = (data: z.infer<typeof DownPaymentValidator>) => {
    setIsPending(true);

    mutation.mutate(data, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setIsOpen(false);
            setIsDialogOpen(false);
            makeToastSucess(res.message);
            return;
          default:
            makeToastError(res.error);
            return;
        }
      },
      onSettled: () => {
        setIsPending(false);
      },
    });
  };

  return (
    <>
      <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
        <DialogTrigger asChild>
          <Button size={'sm'} className={'w-full focus-visible:ring-0 flex mb-2 bg-transparent text-black hover:bg-green-500 gap-x-1 justify-start hover:text-neutral-50 font-medium tracking-tight'}>
            <Icons.add className='h-6 w-6' />
            Add
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
              <span>Add Default Down Payment</span>{' '}
            </DialogTitle>
            <DialogDescription>To open the college enrollment, please ensure that all required fields are completed. Please be aware that this enrollment semester and school year will be reflected in the student enrollment information.</DialogDescription>
          </DialogHeader>
          {isPageLoading ? (
            <div className='w-full h-16 flex items-center justify-center'>
              <Loader />
            </div>
          ) : (
            <Form {...form}>
              <form action='' method='post' className='gap-4 flex flex-col'>
                <SelectInput name={'courseCode'} selectItems={cData.courses} form={form} label={'Course:'} placeholder={'Select Course'} />
                <FormField
                  control={form.control}
                  name={'defaultPayment'}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className='relative bg-slate-50 rounded-lg'>
                          <input
                            type={'text'}
                            id={'defaultPayment'}
                            className={` uppercase block rounded-xl px-5 pb-2 pt-7 w-full text-sm bg-slate-50 border border-gray-200 appearance-nonefocus:outline-none focus:ring-0 focus:border-gray-400 peer pl-4 align-text-bottom`}
                            onDragStart={(e) => e.preventDefault()}
                            placeholder=''
                            maxLength={11}
                            {...field}
                          />
                          <label
                            htmlFor={'defaultPayment'}
                            className='pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5'
                          >
                            {'Default Payment'}
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage className='text-red pl-2' />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
          <DialogFooter className='justify-end flex flex-row'>
            <Button disabled={isPending} type='submit' onClick={form.handleSubmit(actionFormSubmit)} variant='secondary'>
              Submit
            </Button>
            <DialogClose asChild>
              <Button disabled={isPending} type='button' variant='secondary'>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
