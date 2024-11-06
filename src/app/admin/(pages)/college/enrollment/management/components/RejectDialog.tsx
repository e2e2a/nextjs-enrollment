'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

type IProps = {
  isPending: boolean;
  form: any;
  user: any;
  isDialogOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  actionFormSubmit: any;
};

export function RejectDialog({ isPending, user, form, isDialogOpen, setIsDialogOpen, setIsOpen, actionFormSubmit }: IProps) {
  return (
    <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
      <DialogTrigger asChild>
        <Button size={'sm'} className={'w-full focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-red px-2 py-0 gap-x-1 justify-start hover:text-neutral-50 font-medium'}>
          <Icons.ban className='h-4 w-4' />
          Reject Enrollment
        </Button>
      </DialogTrigger>
      <DialogContent
        className='sm:max-w-md w-full bg-white focus-visible:ring-0 '
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <form method='post' onSubmit={(e) => actionFormSubmit(e, 'Rejected')} className='gap-4 flex flex-col'>
          <DialogHeader>
            <DialogTitle className='flex flex-col space-y-1'>
              <span>Rejected Remark</span>{' '}
              <span className='text-sm sm:text-[15px] font-normal'>
                Student Name:{' '}
                <span className='text-sm sm:text-[15px] font-medium capitalize'>
                  {user.profileId.firstname} {user.profileId.middlename[0] + '.'} {user.profileId.lastname} {user.profileId?.extensionName ? user.profileId?.extensionName + '.' : ''}
                </span>
              </span>
            </DialogTitle>
            <DialogDescription className=''>&nbsp;&nbsp;&nbsp;&nbsp;This action will Reject the enrollment of the student, this remark will notify in student.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <FormField
              control={form.control}
              name={'rejectedRemark'}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative bg-slate-50 rounded-lg'>
                      <Textarea
                        id={'rejectedRemark'}
                        className={`block rounded-xl focus-visible:ring-0 px-5 pb-2 pt-7 w-full text-sm bg-slate-50 border border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-2 focus:border-black peer pl-4 align-text-bottom h-16`}
                        onDragStart={(e) => e.preventDefault()}
                        placeholder=''
                        {...field}
                      />
                      <label
                        htmlFor={'rejectedRemark'}
                        className={`text-nowrap absolute cursor-text text-md select-none text-muted-foreground duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5`}
                      >
                        Remark
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
