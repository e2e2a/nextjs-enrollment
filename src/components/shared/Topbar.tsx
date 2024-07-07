import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

import { Button } from '../ui/button';
import Link from 'next/link';
// import { useUserContext } from "@/context/AuthContext";
// import { useSignOutAccount } from "@/lib/react-query/queries";

const Topbar = () => {
//   const navigate = useNavigate();
  //   const { user } = useUserContext();
  //   const { mutate: signOut, isSuccess } = useSignOutAccount();

  //   useEffect(() => {
  //     if (isSuccess) navigate(0);
  //   }, [isSuccess]);

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
    </section>
  );
};

export default Topbar;
