'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import Step1 from './Step1';
import { useSession } from 'next-auth/react';
import Step2 from './Step2';
type IProps = {
  search: any;
  enrollment: any;
};
const EnrollmentForms = ({ search, enrollment }: IProps) => {
  // if (!enrollment) return;
  const [value, setValue] = useState('');
  useEffect(() => {
    if (!enrollment) return setValue('1');
    if (enrollment && enrollment.step) return setValue(enrollment.step as string);
  }, [value, enrollment]);
  return (
    <div className=''>
      <div className='flex flex-col gap-y-4 justify-center items-center'>
        <div className='text-center font-semibold tracking-wider font-poppins pointer-events-none select-none'>Enrollment Progress</div>
        <div className='w-full flex flex-row gap-6 bg-transparent justify-center pointer-events-none select-none'>
          <div className={`border  rounded-full text-[15px] w-6 h-6 text-center ${value == '1' ? 'border-blue-500 scale-[2] duration-500 transition-transform' : 'border-black'}`}>1</div>
          <div className={`border  rounded-full text-[15px] w-6 h-6 text-center ${value == '2' ? 'border-blue-500 scale-[2] duration-500 transition-transform' : 'border-black'}`}>2</div>
          <div className={`border  rounded-full text-[15px] w-6 h-6 text-center ${value == '3' ? 'border-blue-500 scale-[2] duration-500 transition-transform' : 'border-black'}`}>3</div>
          {/* <div className={`border  rounded-full text-[15px] w-6 h-6 text-center ${value == 4 ? 'border-blue-500 scale-[2] duration-500 transition-transform' : 'border-black'}`}>4</div> */}
        </div>
      </div>
      <Tabs value={`${value}`} className='w-full gap-4 mt-5'>
        <Step1 search={search} enrollment={enrollment} />
        <Step2 enrollment={enrollment} />

        <TabsContent value='3'>
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Make changes to your account here. Click save when you&apos;re done.</CardDescription>
            </CardHeader>
            <CardContent className='w-full space-y-2'>3</CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value='4'>
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Make changes to your account here. Click save when you&apos;re done.</CardDescription>
            </CardHeader>
            <CardContent className='w-full space-y-2'>4</CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value='5'>
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Make changes to your account here. Click save when you&apos;re done.</CardDescription>
            </CardHeader>
            <CardContent className='w-full space-y-2'>5</CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnrollmentForms;
