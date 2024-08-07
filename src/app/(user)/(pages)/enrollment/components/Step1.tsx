import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import React from 'react';

const Step1 = () => {
  return (
    <TabsContent value='1' className='p-5'>
      <Card className='border-0'>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Make changes to your account here. Click save when you're done.</CardDescription>
        </CardHeader>
        <CardContent className='w-full space-y-2'>
          <div className='space-y-1'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' defaultValue='Pedro Duarte' />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='username'>Username</Label>
            <Input id='username' defaultValue='@peduarte' />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save changes</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
};

export default Step1;
