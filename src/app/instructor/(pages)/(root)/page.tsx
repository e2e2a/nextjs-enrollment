'use client';
import { useSession } from 'next-auth/react';

const Home = () => {
  const { data: s } = useSession();
  return (
    // <ProtectedLayout>
    <div className='bg-white py-5 px-5 rounded-xl mr-5 mb-7'>
      <div className='flex w-full items-center text-black mb-7'>
        <div className='flex flex-col gap-8'>
          <h1 className='text-lg sm:text-2xl font-medium capitalize'>
            Welcome,{' '}
            <span className='uppercase'>
              {s?.user?.firstname} {s?.user?.lastname}
            </span>
          </h1>
          <p className='text-sm sm:text-[15px] font-normal text-muted-foreground'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome to our team! We&apos;re excited to have you on board as an instructor and look forward to the knowledge and inspiration you&apos;ll share with our students and staff.</p>
        </div>
      </div>
    </div>
    // </ProtectedLayout>
  );
};

export default Home;
