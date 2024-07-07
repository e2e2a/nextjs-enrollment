// import {
//     Route,
//     Routes,
//     Outlet,
//     useParams,
//     useLocation,
//   } from "react-router-dom";

// import { LikedPosts } from "@/_root/pages";
// import { useUserContext } from "@/context/AuthContext";
// import { useGetUserById } from "@/lib/react-query/queries";
// import { GridPostList, Loader } from "@/components/shared";
'use client';
import { auth } from '@/auth';
import Loader from '@/components/shared/Loader';
// import { getUserProfileByUsername } from '@/lib/api';
// import { useGetUserProfileByUsername } from '@/lib/queries';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className='flex-center gap-2'>
    <p className='small-semibold lg:body-bold text-primary-500'>{value}</p>
    <p className='small-medium lg:base-medium text-light-2'>{label}</p>
  </div>
);

const Profile = ({ params }: any) => {
  const [currentUserProfile, setCurrentUserProfile] = useState<any | null>(null);
  const { username } = params;

  const fetchUserProfile = useCallback(async () => {
    try {
      if (!username) {
        console.log('Username not available');
        return;
      }

      // const user = await getUserProfileByUsername(username);
      // setCurrentUserProfile(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile,username]);

  if (currentUserProfile) {
    console.log('Current user profile:', currentUserProfile);
  }
  // if (!currentUserProfile) {
  //   return <div>No user profile found</div>;
  // }
  // if (!currentUserProfile)
  //   return (
  //     <div className='flex-center w-full h-full'>
  //       <Loader />
  //     </div>
  //   );

  return (
    <div className='profile-container'>
      <div className='profile-inner_container'>
        <div className='flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7'>
          <img
            // src={'/icons/profile-placeholder.svg'}
            src={
              currentUserProfile?.image || "/icons/profile-placeholder.svg"
            }
            alt='profile'
            className='w-28 h-28 lg:h-36 lg:w-36 rounded-full'
          />
          <div className='flex flex-col flex-1 justify-between md:mt-2'>
            <div className='flex flex-col w-full'>
              <h1 className='text-center xl:text-left h3-bold md:h1-semibold w-full'>
                {/* {currentUser.name} */} firstname
                {/* {JSON.stringify(currentUserProfile)} */}
              </h1>
              <p className='small-regular md:body-medium text-light-3 text-center xl:text-left'>
                {/* @{currentUser.username} */} username
              </p>
            </div>

            <div className='flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20'>
              {/* <StatBlock value={currentUser.posts.length} label="Posts" /> */}
              <StatBlock value={13} label='Posts' />
              <StatBlock value={20} label='Followers' />
              <StatBlock value={20} label='Following' />
            </div>

            <p className='small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm'>
              {/* {currentUser.bio} */} my bio
            </p>
          </div>

          <div className='flex justify-center gap-4'>
            {/* <div className={`${user.id !== currentUser.$id && "hidden"}`}>
                  <Link
                    href={`/update-profile/${currentUser.$id}`}
                    className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                      user.id !== currentUser.$id && "hidden"
                    }`}>
                    <img
                      src={"/assets/icons/edit.svg"}
                      alt="edit"
                      width={20}
                      height={20}
                    />
                    <p className="flex whitespace-nowrap small-medium">
                      Edit Profile
                    </p>
                  </Link>
                </div>
                <div className={`${user.id === id && "hidden"}`}>
                  <Button type="button" className="shad-button_primary px-8">
                    Follow
                  </Button>
                </div> */}
          </div>
        </div>
      </div>

      {/* {currentUserProfile.id === user.id && (
        <div className='flex max-w-5xl w-full'>
          <Link
            href={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && '!bg-dark-3'
            }`}
          >
            <img
              src={'/assets/icons/posts.svg'}
              alt='posts'
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            href={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && '!bg-dark-3'
            }`}
          >
            <img src={'/assets/icons/like.svg'} alt='like' width={20} height={20} />
            Liked Posts
          </Link>
        </div>
      )} */}

      {/* <Routes>
            <Route
              index
              element={<GridPostList posts={currentUser.posts} showUser={false} />}
            />
            {currentUser.$id === user.id && (
              <Route path="/liked-posts" element={<LikedPosts />} />
            )}
          </Routes> */}
      {/* <Outlet /> */}
    </div>
  );
};

export default Profile;
