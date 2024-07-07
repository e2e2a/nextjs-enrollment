'use client';
import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import Link from 'next/link';
import { bottombarLinks } from '@/constant';
import { usePathname } from 'next/navigation';
// import { useUserContext } from "@/context/AuthContext";
// import { useSignOutAccount } from "@/lib/react-query/queries";

const Topbar = () => {
  //   const navigate = useNavigate();
  //   const { user } = useUserContext();
  //   const { mutate: signOut, isSuccess } = useSignOutAccount();

  //   useEffect(() => {
  //     if (isSuccess) navigate(0);
  //   }, [isSuccess]);
  const pathname = usePathname();
  return (
    <section className='topbar'>
      <div className='flex-between py-4 px-5'>
        <Link href='/' className='flex gap-3 items-center'>
          <img src='/images/1aaa.png' alt='logo' width={65} height={210} />
        </Link>

        <div className='flex gap-4'>
          <Button
            variant='ghost'
            className='shad-button_ghost'
            // onClick={() => signOut()}>
            // onClick={() => {}}
          >
            <img src='/icons/logout.svg' alt='logout' />
          </Button>
          <Link href={`/profile`} className='flex-center gap-3'>
            <img
              //   src={user.imageUrl || "/icons/profile-placeholder.svg"}
              src={'/icons/profile-placeholder.svg'}
              alt='profile'
              className='h-8 w-8 rounded-full'
            />
          </Link>
        </div>
      </div>
      <div className='flex-between w-full rounded-b-[20px] bg-dark-2 px-[6rem] py-4 '>
        {bottombarLinks.map((link) => {
          const isActive = pathname === link.route;
          return (
            <Link
              key={`bottombar-${link.label}`}
              href={link.route}
              className={`${isActive && ' rounded-[10px] bg-primary-500 '} flex-center flex-col gap-1 p-2 transition`}
            >
              <img src={link.imgURL} alt={link.label} width={16} height={16} className={`${isActive && 'invert-white'}`} />

              <p className='tiny-medium text-light-2'>{link.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Topbar;
