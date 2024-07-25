import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { UserAvatar } from '../UserAvatar';
import Link from 'next/link';
import { Icons } from '../../../Icons';
import { accountCenterItems, helpAndSupportItem, userAvatarItem } from '@/constant/userAvatar';
import NavbarFooter from '../../NavbarFooter';
import PasswordTab from './PasswordTab';
import EmailTab from './EmailTab';
import BirthdayTab from './BirthdayTab';

export function UserAvatarTabs() {
  const { data } = useSession();
  const session = data?.user;
  const [activeTab, setActiveTab] = useState('');

  const [animationClass, setAnimationClass] = useState('');

  const handleTabChange = (newTab: any) => {
    if (newTab !== activeTab) {
      setAnimationClass('animate-fadeOut');
      setTimeout(() => {
        setActiveTab(newTab);
        setAnimationClass('animate-fadeIn');
      }, 10); // Match the duration of the fadeOut animation
    }
  };

  return (
    <div className='w-[300px] sm:w-[330px]'>
      {activeTab === '' && (
        <div className='w-full text-left bg-white space-y-1'>
          <div className='w-full px-2 py-2'>
            <div className='border rounded-md p-2 flex flex-col sm:gap-y-2'>
              <Link href={'/asdw'} className='flex items-center w-full p-2 hover:bg-slate-300 hover:text-white rounded-md'>
                <div className=''>
                  <UserAvatar
                    session={{ firstname: session?.firstname, imageUrl: session?.imageUrl, asd: 'asdas1' || null }}
                    className='h-10 w-10'
                  />
                </div>
                <div className='flex items-center justify-start gap-2 p-2'>
                  <div className='flex flex-col space-y-1 leading-none'>
                    {session?.firstname && (
                      <p className='font-medium text-[18px]'>
                        {session.firstname} {session.lastname}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
              <div className=' w-full p-2'>
                <Link
                  href={'/profile'}
                  className='flex items-center w-full p-1 font-medium hover:bg-slate-300 rounded-md justify-center bg-slate-200'
                >
                  See study load
                </Link>
              </div>
            </div>
          </div>
          {userAvatarItem.map((item, index) => {
            const Icon = Icons[item.icon as keyof typeof Icons];
            return item.type === 'button' ? (
              item.title === 'Logout' ? (
                <Button
                  key={index}
                  onClick={() => handleTabChange('')}
                  className={`hover:bg-slate-300 hover:text-white w-full rounded-md justify-start items-center text-[16px] p-2`}
                >
                  <div className='flex items-center gap-2'>
                    <div className='rounded-full bg-slate-200 p-1'>
                      <Icon />
                    </div>
                    Logout
                  </div>
                </Button>
              ) : (
                <Button
                  key={index}
                  onClick={() => handleTabChange(`${item.tab}`)}
                  // example group
                  // className={`group hover:bg-slate-300 w-full rounded-md gap-2 justify-between items-center text-[16px] p-2`}
                  className={` hover:bg-slate-300 w-full rounded-md gap-2 justify-between items-center text-[16px] p-2`}
                >
                  <div className='flex items-center gap-2'>
                    <div className='rounded-full bg-slate-200 p-1'>
                      {/* <div className='rounded-full bg-slate-200 p-1 group-hover:bg-slate-300'> */}
                      <Icon />
                    </div>
                    {item.title}
                  </div>
                  <div className=''>
                    <Icons.chevronRight />
                  </div>
                </Button>
              )
            ) : item.type === 'link' ? (
              <Link
                key={index}
                href={'/feedback'}
                className={`hover:bg-slate-300 w-full rounded-md px-2 flex justify-start items-center py-1 font-medium text-[16px]`}
              >
                <div className='flex items-center gap-2 w-full'>
                  <div className='rounded-full bg-slate-200 p-1'>
                    <Icon />
                  </div>
                  {item.title}
                </div>
              </Link>
            ) : null;
          })}
          {/* <NavbarFooter /> */}
        </div>
      )}

      <div className={`transition-opacity duration-100 ${animationClass}`}>
        {activeTab === 'Account center' && (
          <div className=' transition ease-in-out animate-fadeIn gap-y-6'>
            <div className='flex items-center justify-start py-4'>
              <Button onClick={() => handleTabChange('')} className={` hover:text-slate-400 rounded-md p-3`}>
                <Icons.arrowLeft />
              </Button>
              {session?.firstname && <p className='font-bold text-[1.5rem] h-full'>Account center</p>}
            </div>
            <div className='w-full flex-col text-left items-start bg-white mb-1 mt-1'>
              <PasswordTab />
              {accountCenterItems.map((item, index) => {
                const Icon = Icons[item.icon as keyof typeof Icons];
                return item.href ? (
                  <Link
                    key={index}
                    href={`${item.href}`}
                    className={`hover:bg-slate-300 w-full rounded-md px-2 flex justify-start items-center py-1 font-medium text-[16px]`}
                  >
                    <div className='flex items-center gap-2'>
                      <div className='rounded-full bg-slate-200 p-1'>
                        <Icon />
                      </div>
                      {item.title}
                    </div>
                  </Link>
                ) : (
                  <Button
                    key={index}
                    onClick={() => handleTabChange(`${item.tab}`)}
                    // example group
                    // className={`group hover:bg-slate-300 w-full rounded-md gap-2 justify-between items-center text-[16px] p-2`}
                    className={` hover:bg-slate-300 w-full rounded-md gap-2 justify-between items-center text-[16px] p-2`}
                  >
                    <div className='flex items-center gap-2'>
                      <div className='rounded-full bg-slate-200 p-1'>
                        {/* <div className='rounded-full bg-slate-200 p-1 group-hover:bg-slate-300'> */}
                        <Icon />
                      </div>
                      {item.title}
                    </div>
                    <div className=''>
                      <Icons.chevronRight />
                    </div>
                  </Button>
                );
              })}
              
            </div>
          </div>
        )}
        {activeTab === 'Help & support' && (
          <div className=' transition ease-in-out animate-fadeIn gap-y-6'>
            <div className='flex items-center justify-start py-4'>
              <Button onClick={() => handleTabChange('')} className={` hover:text-slate-400 rounded-md p-3`}>
                <Icons.arrowLeft />
              </Button>
              {session?.firstname && <p className='font-bold text-[1.5rem] h-full'>Help & support</p>}
            </div>
            <div className='w-full flex-col text-left items-start bg-white mb-1'>
              {helpAndSupportItem.map((item, index) => {
                const Icon = Icons[item.icon as keyof typeof Icons];
                return (
                  <Link
                    key={index}
                    href={`${item.href}`}
                    className={`hover:bg-slate-300 w-full rounded-md px-2 flex justify-start items-center py-1 font-medium text-[16px]`}
                  >
                    <div className='flex items-center gap-2'>
                      <div className='rounded-full bg-slate-200 p-1'>
                        <Icon />
                      </div>
                      {item.title}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
        {/* @todo change this to personal details */}
        {activeTab === 'Personal details' && (
          <div className=' transition ease-in-out animate-fadeIn gap-y-6'>
            <div className='flex items-center justify-start pt-4'>
              <Button onClick={() => handleTabChange('Account center')} className={` hover:text-slate-400 rounded-md p-3`}>
                <Icons.arrowLeft />
              </Button>
              {session?.firstname && <p className='font-bold text-[1.5rem] h-full'>Personal details</p>}
            </div>
            <div className='px-3 flex text-[15px] pb-4 w-full tracking-wide text-muted-foreground'>
              <span className=''>Your account security is important.</span>
            </div>
            <div className='w-full flex-col text-left items-start bg-white mb-1 px-1'>
              <EmailTab />
              <BirthdayTab />
            </div>
          </div>
        )}
        <NavbarFooter />
      </div>
    </div>
  );
}
