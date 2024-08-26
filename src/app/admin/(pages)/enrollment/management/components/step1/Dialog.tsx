import { Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { EnrollmentBlockTypeValidator } from '@/lib/validators/Validator';
import { selectType } from '@/constant/enrollment';
import { useApprovedEnrollmentStep1Mutation } from '@/lib/queries';

type IProps = {
  isPending: boolean;
  user: any;
};
export function DialogStep1Button({ isPending, user }: IProps) {
  const mutation = useApprovedEnrollmentStep1Mutation();
  const form = useForm<z.infer<typeof EnrollmentBlockTypeValidator>>({
    resolver: zodResolver(EnrollmentBlockTypeValidator),
    defaultValues: {
      blockType: '',
    },
  });
  const actionFormSubmit = (data: z.infer<typeof EnrollmentBlockTypeValidator>) => {
    // setIsPending(true);
    const dataa = {
      EId: user._id,
      ...data,
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
          Confirm Enrollee
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
          <DialogTitle className='flex flex-col'>
            <span>Confirm Enrollee</span>{' '}
            <span className='text-sm sm:text-[15px] font-normal'>
              Student Name:{' '}
              <span className='text-sm sm:text-[15px] font-medium capitalize'>
                {user.profileId.firstname} {user.profileId.lastname}
              </span>
            </span>
          </DialogTitle>
          <DialogDescription>To confirm the enrollee, please fill in the required input indicating the type of block assigned to them.</DialogDescription>
        </DialogHeader>
        {/* here */}
        <Form {...form}>
          <form action='' method='post'>
            <FormField
              control={form.control}
              name={'blockType'}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative bg-slate-50 rounded-lg'>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id={'scholarType'} className='w-full pt-10 pb-4 capitalize focus-visible:ring-0 text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'>
                          <SelectValue placeholder={'Select student type'} />
                        </SelectTrigger>
                        <SelectContent className='bg-white border-gray-300 focus-visible:ring-0'>
                          <SelectGroup className='focus-visible:ring-0'>
                            {selectType.blockType.map((item, index) => (
                              <SelectItem value={item.value} key={index} className='capitalize'>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <label
                        htmlFor={'blockType'}
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
