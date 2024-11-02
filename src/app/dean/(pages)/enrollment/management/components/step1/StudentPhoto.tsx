'use client';
import { useEffect, useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { fireAuth, storage } from '@/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Icons } from '@/components/shared/Icons';
const StudentPhoto = ({ user }: { user: any }) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchFileUrl = async () => {
      try {
        if (user && user.profileId.photoUrl) {
          const photoPath = `enrollment/studentphoto/${user?.profileId._id}/${user?.profileId.photoUrl}`;
          // if(!fireAuth.currentUser) await signInWithEmailAndPassword(fireAuth, 'admin@gmail.com', 'qweqwe')

          const fileRef = ref(storage, photoPath);

          const url = await getDownloadURL(fileRef);
          setPhotoUrl(url);
        } else {
          setPhotoUrl(null);
        }
      } catch (error) {
        console.error('Error fetching file URL: ', error);
      }
    };
    if (user) {
      fetchFileUrl();
    }
  }, [user, photoUrl]);

  const handleDownload = async () => {
    if (photoUrl) {
      try {
        const response = await fetch(photoUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${user.profileId.firstname} ${user.profileId.middlename[0] + '.'} ${user.profileId.lastname} ${user.profileId.extensionName ? user.profileId.extensionName : ''}.png`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading file: ', error);
      }
    }
  };
  return (
    <>
      {/* {user ? ( */}
      {user ? (
        <div className='items-center justify-center '>
          <Button type='button' onClick={() => setIsOpen(true)} className='text-sm hover:underline text-blue-600'>
            Open
          </Button>
          <Dialog open={isOpen} modal={false} onOpenChange={setIsOpen}>
            <DialogContent className='max-w-xl bg-white w-full py-10 '>
              <DialogHeader>
                <DialogTitle className='flex flex-col space-y-1'>
                  <div className='flex flex-row'>
                    <div className='flex-1 flex items-start flex-col'>
                      <span>Student Photo</span>
                      <span className='font-medium sm:text-lg text-xs'>
                        Student:{' '}
                        <span className=' capitalize sm:text-lg text-xs'>
                          {user.profileId.firstname} {user.profileId.middlename[0] + '.'} {user.profileId.lastname} {user.profileId.extensionName ? user.profileId.extensionName : ''}
                        </span>
                      </span>
                    </div>
                    <div className='flex justify-end items-start'>
                      <Button type='button' onClick={handleDownload} className='text-sm hover:underline text-blue-600'>
                        <Icons.download className='h-5 w-5' />
                      </Button>
                    </div>
                  </div>
                </DialogTitle>
                <DialogDescription className='hidden'>asdasd</DialogDescription>
              </DialogHeader>
              {photoUrl ? (
                <div className='overflow-y-auto max-h-[400px] '>
                  {/* <Image src={user.photoUrl} alt={user.profileId.firstname || 'Image'} width={600} priority height={600} className='object-contain' /> */}
                  <Image src={photoUrl} alt={user.profileId.firstname || 'nothing to say'} width={600} priority height={600} className='object-contain' />
                </div>
              ) : (
                <div className='items-center justify-center text-red'>No Student Photo</div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className='items-center justify-center text-red'>No Student Photo</div>
      )}
    </>
  );
};

export default StudentPhoto;
