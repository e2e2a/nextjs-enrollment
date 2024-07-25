'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Icons } from '../Icons';
const UserNavSettingDialog = () => {
  const [view, setView] = useState('');
  return (
    <Dialog>
      <DialogTrigger className='text-sm ml-2' asChild>
        <Link href={''}>Account</Link>
      </DialogTrigger>
      <DialogContent className={`bg-white sm:max-w-[750px] max-h-[450px] `}>
        <div className='grid flex-1 gap-12 md:grid-cols-[200px_1fr]'>
          <div className=''>
            <DialogHeader>
              <DialogTitle>Account Center</DialogTitle>
              <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <div className='flex-col gap-4 py-4'>
              <div className={`items-center gap-4 ${view === 'Profile' ? ' bg-gray-600 rounded-lg text-white' : null}`}>
                <Button className='text-right' onClick={() => setView('Profile')}>
                  <Icons.user className='mr-2 h-6 w-6' />
                  Profile
                </Button>
              </div>
              <div className='items-center gap-4'>
                <Button className='text-right' onClick={() => setView('Profile')}>
                  Password and security
                </Button>
              </div>
              <div className='items-center gap-4 w-full'>
                <Button className='text-right' onClick={() => setView('NewPassword')}>
                  Perosnal details
                </Button>
              </div>
              <div className='items-center gap-4 w-full'>
                <Button className='text-right' onClick={() => setView('NewPassword')}>
                  Payment
                </Button>
              </div>
            </div>
          </div>
          <div className='max-h-[400px] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
            </DialogHeader>
            {view === 'Profile' ? (
              <div className='grid gap-4 '>
                <div className='grid grid-cols-3 items-center gap-1'>
                  <Label htmlFor='name' className='text-left'>
                    Name
                  </Label>
                  <Input id='name' defaultValue='Pedro Duarte' className='col-span-3' />
                </div>
                <div className='grid grid-cols-3 items-center gap-1'>
                  <Label htmlFor='username' className='text-left'>
                    Username
                  </Label>
                  <Input id='username' defaultValue='@peduarte' className='col-span-3' />
                </div>
              </div>
            ) : view === 'NewPassword' ? (
              <div className='grid gap-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='name' className='text-right'>
                    Password
                  </Label>
                  <Input id='name' defaultValue='Pedro Duarte' className='col-span-3' />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='username' className='text-right'>
                    NewPassword
                  </Label>
                  <Input id='username' defaultValue='@peduarte' className='col-span-3' />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='username' className='text-right'>
                    NewPassword
                  </Label>
                  <Input id='username' defaultValue='@peduarte' className='col-span-3' />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='username' className='text-right'>
                    NewPassword
                  </Label>
                  <Input id='username' defaultValue='@peduarte' className='col-span-3' />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='username' className='text-right'>
                    NewPassword
                  </Label>
                  <Input id='username' defaultValue='@peduarte' className='col-span-3' />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='username' className='text-right'>
                    NewPassword
                  </Label>
                  <Input id='username' defaultValue='@peduarte' className='col-span-3' />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='username' className='text-right'>
                    NewPassword
                  </Label>
                  <Input id='username' defaultValue='@peduarte' className='col-span-3' />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='username' className='text-right'>
                    NewPassword
                  </Label>
                  <Input id='username' defaultValue='@peduarte' className='col-span-3' />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='username' className='text-right'>
                    NewPassword
                  </Label>
                  <Input id='username' defaultValue='@peduarte' className='col-span-3' />
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <DialogFooter>
          <Button type='submit'>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserNavSettingDialog;
