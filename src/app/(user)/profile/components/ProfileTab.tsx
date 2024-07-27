import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { NewPasswordValidator } from '@/lib/validators/Validator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { Icons } from '@/components/shared/Icons';
import Input from './Input';
interface IProps {
  isNotEditable: boolean;
}
const ProfileTab = ({ isNotEditable }: IProps) => {
  const { data } = useSession();
  const session = data?.user;
  const form = useForm<z.infer<typeof NewPasswordValidator>>({
    resolver: zodResolver(NewPasswordValidator),
    defaultValues: {
      currentPassword: '',
      password: '',
      CPassword: '',
    },
  });
  return (
    <Form {...form}>
      <Card className=''>
        <CardHeader>
          <CardTitle className='py-3'>
            <div className='flex justify-between'>
              <h1>Profile</h1>
              <div className='bg-slate-100 rounded-full py-1.5 px-2 cursor-pointer flex items-center gap-1' title='Edit'>
                <Icons.squarePen className='h-5 w-5 fill-white stroke-blue-600' />
                <span className='hidden sm:flex tracking-normal text-sm'>Edit</span>
              </div>
            </div>
            <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-2 '>
          <Input isNotEditable={isNotEditable} name={'currentPassword'} type={'password'} form={form} label={'Current Password'} />
          <Input isNotEditable={isNotEditable} name={'password'} type={'password'} form={form} label={'New Password'} />
          <Input isNotEditable={isNotEditable} name={'CPassword'} type={'password'} form={form} label={'Re-type new password'} />
        </CardContent>
        <CardFooter>
          <Button>Save password</Button>
        </CardFooter>
      </Card>
    </Form>
  );
};

export default ProfileTab;
