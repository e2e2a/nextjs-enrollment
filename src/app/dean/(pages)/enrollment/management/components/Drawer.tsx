'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { EnrollmentApprovedStep2 } from '@/lib/validators/Validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { selectType } from '@/constant/enrollment';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
type IProps = {
  user: any;
};
export function DataTableDrawer({ user }: IProps) {
  const [goal, setGoal] = React.useState(350);
  // const mutation = useApprovedEnrollmentStep2Mutation();
  const [isScholarType, setIsScholarType] = React.useState<string | null>(null);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [data, setData] = React.useState('');
  const form = useForm<z.infer<typeof EnrollmentApprovedStep2>>({
    resolver: zodResolver(EnrollmentApprovedStep2),
    defaultValues: {
      studentType: data ? data : '',
      scholarType: '',
    },
  });
  const onSubmit = (data: z.infer<typeof EnrollmentApprovedStep2>) => {
    // setIsPending(true);
    const dataa = {
      ...data,
      EId: user._id,
    };
    // mutation.mutate(dataa, {
    //   onSuccess: (res) => {
    //     switch (res.status) {
    //       case 200:
    //       case 201:
    //       case 203:
    //         // setTypeMessage('success');
    //         return;
    //       default:
    //         // setMessage(res.error);
    //         return;
    //     }
    //   },
    //   onSettled: () => {
    //     // setIsPending(false);
    //   },
    // });
  };
  return (
    <Drawer modal={true}>
      <DrawerTrigger className='w-full' asChild>
        <Button className='bg-transparent border-0 focus-visible:ring-0 justify-start items-center flex p-0 font-normal'>Confirmation</Button>
      </DrawerTrigger>
      <DrawerContent className='bg-neutral-50 max-h-[65vh] flex px-0 py-0'>
        <div className=' w-full overflow-auto flex justify-center items-center'>
          <div className='w-[100%] px-2 md:px-0 md:w-[60%] h-[65vh]'>
            <DrawerHeader className=' flex flex-col justify-center items-center'>
              <DrawerTitle className='sm:text-4xl text-[26px]'>Confirmation Process</DrawerTitle>
              <div className='gap-1.5 flex text-[13px] sm:text-[15px]'>
                <span className='font-normal'>Student Name:</span>
                <span className='capitalize font-medium'>
                  {user?.profileId?.firstname ?? ''} {user?.profileId?.middlename[0] && user?.profileId?.middlename[0] + '.'} {user?.profileId?.lastname ?? ''}
                </span>
              </div>
              <DrawerDescription className='opacity-100 text-black font-normal text-sm'>Please Set first the student type and scholar type.</DrawerDescription>
            </DrawerHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                onChange={(e) => {
                  setIsScholarType(form.getValues('scholarType'));
                  if (isScholarType && isScholarType !== '' && isScholarType !== 'None') {
                    form.setValue('studentType', 'Regular');
                    setIsDisabled(true);
                  } else {
                    setIsDisabled(false);
                  }
                }}
              >
                <div className='justify-center items-center flex-wrap'>
                  <div className='flex flex-col gap-4'>
                    <FormField
                      control={form.control}
                      name={'scholarType'}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className='relative bg-slate-50 rounded-lg'>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setIsScholarType(value);
                                }}
                                value={field.value}
                              >
                                <SelectTrigger id={'scholarType'} className='w-full pt-10 pb-4 text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'>
                                  <SelectValue placeholder={'Select student type'} />
                                </SelectTrigger>
                                <SelectContent className='bg-white border-gray-300'>
                                  <SelectGroup>
                                    {selectType.scholarType.map((item, index) => (
                                      <SelectItem value={item.name} key={index} className='capitalize'>
                                        {item.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <label
                                htmlFor={'scholarType'}
                                className='pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5'
                              >
                                {'Scholar type'}
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage className='text-red pl-2' />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={'studentType'}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className='relative bg-slate-50 rounded-lg'>
                              <Select disabled={isDisabled} onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id={'studentType'} className='w-full pt-10 pb-4 text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'>
                                  <SelectValue placeholder={'Select student type'} />
                                </SelectTrigger>
                                <SelectContent className='bg-white border-gray-300'>
                                  <SelectGroup>
                                    {selectType.studentType.map((item, index) => (
                                      <SelectItem value={item.name} key={index} className='capitalize'>
                                        {item.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <label
                                htmlFor={'studentType'}
                                className='pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5'
                              >
                                {'Student type'}
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage className='text-red pl-2' />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <DrawerFooter className='flex w-full flex-row justify-end items-center'>
                  <Button type='submit'>Submit</Button>
                  <DrawerClose type='button' asChild>
                    <Button variant='outline' type='button'>
                      Cancel
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </Form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
