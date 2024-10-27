'use client';
import { Icons } from '@/components/shared/Icons';
import { UserAvatar } from '@/components/shared/nav/UserAvatar/UserAvatar';
import { Button } from '@/components/ui/button';
import React, { useRef, useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from '@/firebase';
import Image from 'next/image';
import Username from './Username';
import { useUpdateProfileMutation } from '@/lib/queries/profile/update/session';

type Iprops = {
  session: any;
  profile: any;
};
const ProfileDropdown = ({ session, profile }: Iprops) => {
  const [imageFile, setImageFile] = useState<File>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [downloadURL, setDownloadURL] = useState('');
  const [dialogOpen, setDialogOpen] = useState<boolean | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [progressUpload, setProgressUpload] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mutation = useUpdateProfileMutation();

  const handleSelectedFile = (files: FileList | null) => {
    if (files && files[0].size < 10000000) {
      const file = files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      makeToastError('File size too large');
    }
  };

  const handleUploadFile = () => {
    if (imageFile) {
      setIsUploading(true);
      const name = imageFile.name;
      const storageRef = ref(storage, `profile/${profile._id}/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgressUpload(progress); // to show progress upload
          // switch (snapshot.state) {
          //   case 'paused':
          //     console.log('Upload is paused');
          //     break;
          //   case 'running':
          //     console.log('Upload is running');
          //     break;
          // }
        },
        (error) => {
          makeToastError(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            const data = {
              role: session.role,
              profileId: profile._id,
              imageUrl: url,
            };
            mutation.mutate(data, {
              onSuccess: (res) => {
                switch (res.status) {
                  case 200:
                  case 201:
                  case 203:
                    setDialogOpen(false);
                    makeToastSucess('Photo has been uploaded.');
                    return;
                  default:
                    makeToastError('Photo upload failed.');
                    return;
                }
              },
              onSettled: () => {
                setIsUploading(false);
              },
            });
            setDownloadURL(url);
            // setIsUploading(false);
          });
        }
      );
    } else {
      makeToastError('File not found');
    }
  };
  const handleRemoveFile = () => setImageFile(undefined);
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <div className='flex items-center gap-8 flex-col relative mb-4 w-full max-w-[73rem] border-b border-r border-l border-gray-200 rounded-b-xl pt-10 pb-12 px-11 bg-sky-50 shadow-xl drop-shadow-xl'>
      <div className='flex flex-col items-center flex-1 gap-5'>
        <Dialog
          // modal={true}
          open={dialogOpen}
          onOpenChange={(e) => {
            setDialogOpen(e);
            setImagePreview(null);
          }}
        >
          <DialogTrigger asChild>
            <div className='active:scale-[99.5%] active:drop-shadow-2xl active:select-none transition-transform duration-100 active:opacity-85 mt-1 select-none cursor-pointer'>
              <div className='flex flex-col h-[168px] w-[168px] relative select-none border shadow-md drop-shadow-md border-gray-200 rounded-full'>
                <UserAvatar session={{ firstname: profile?.firstname, imageUrl: profile?.imageUrl }} className='' />
                <div className='absolute bottom-3 right-5 bg-slate-300 p-1 rounded-full'>
                  <Icons.camera className='h-6 w-6 text-muted-foreground fill-white' />
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent
            className='w-full outline-none bg-white duration-0'
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <DialogHeader className=''>
              <DialogTitle className='text-center w-full'>Choose profile picture</DialogTitle>
              <DialogDescription className='hidden'>a.</DialogDescription>
            </DialogHeader>
            <div className='mt-4'>
              <div className='w-full flex flex-col items-center justify-center'>
                <div className={`flex flex-col h-[168px] w-[168px] relative select-none ${imagePreview ? 'border shadow-md drop-shadow-md border-gray-200 rounded-full' : ''}`}>
                  <UserAvatar session={{ firstname: session?.firstname, imageUrl: imagePreview ? imagePreview : '' }} className='' />
                </div>
                <input type='file' ref={fileInputRef} style={{ display: 'none' }} accept='image/png' onChange={(e) => handleSelectedFile(e.target.files)} />

                <Button onClick={handleClick} disabled={isUploading}>
                  <span className='cursor-pointer p-2 text-blue-600 gap-0 md:gap-2 rounded-md flex items-center'>
                    <div className='bg-slate-100 rounded-full'>
                      <Icons.add className='h-6 w-6' />
                    </div>
                    <div className=''>Upload photo</div>
                  </span>
                </Button>
              </div>
            </div>
            <div className='w-full flex items-center justify-center'>
              <Button type='submit' autoFocus={false} className='bg-blue-600 w-44 flex-col ' onClick={handleUploadFile} disabled={!isUploading && !imagePreview}>
                <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Save Changes'}</span>
              </Button>
            </div>
          </DialogContent>
          <DialogFooter className='hidden'> </DialogFooter>
        </Dialog>

        <div className='flex flex-col flex-1 md:mt-2'>
          <div className='flex flex-col w-full'>
            {profile?.firstname && profile?.lastname ? (
              <h1 className='text-center h3-bold md:h1-semibold w-full capitalize'>
                {profile.firstname} {profile.lastname}
              </h1>
            ) : null}
            <Username profile={profile} />
          </div>
        </div>
        {/* <div className='flex justify-center'>
          <div className={``}>
            <Button type='button' className='shad-button_primary px-8'>
              Enroll now!
            </Button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ProfileDropdown;
