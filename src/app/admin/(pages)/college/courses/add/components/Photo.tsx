'use client';
import { Icons } from '@/components/shared/Icons';
import { UserAvatar } from '@/components/shared/nav/UserAvatar/UserAvatar';
import { Button } from '@/components/ui/button';
import React, { useRef, useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { makeToastError } from '@/lib/toast/makeToast';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from '@/firebase';
import Image from 'next/image';
import { useUpdateProfilePhoto } from '@/lib/queries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
type IProps = {
  session: any;
  handleSelectedFile: (files: FileList | null) => void;
  handleClick: () => void;
  fileInputRef: any;
  imagePreview: any;
  photoError: string;
  isUploading: boolean;
};
const Photo = ({ session, handleSelectedFile, handleClick, fileInputRef, imagePreview,photoError, isUploading }: IProps) => {
  const [imageFile, setImageFile] = useState<File>();
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [downloadURL, setDownloadURL] = useState('');
  const [dialogOpen, setDialogOpen] = useState<boolean | undefined>(undefined);
  // const [isUploading, setIsUploading] = useState(false);
  const [progressUpload, setProgressUpload] = useState(0);
  // const fileInputRef = useRef<HTMLInputElement>(null);
  const mutation = useUpdateProfilePhoto();

  // const handleSelectedFile = (files: FileList | null) => {
  //   if (files && files?.length > 0) {
  //     if (files[0].size < 10000000) {
  //       const file = files[0];
  //       setImageFile(file);
  //       // Preview the image
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setImagePreview(reader.result as string);
  //       };
  //       reader.readAsDataURL(file);

  //       console.log(file);
  //     } else {
  //       makeToastError('File size too large');
  //     }
  //   }
  // };

  // const handleUploadFile = () => {
  //   if (imageFile) {
  //     setIsUploading(true);
  //     const name = imageFile.name;
  //     const storageRef = ref(storage, `profile/${session.id}/${name}`);
  //     const uploadTask = uploadBytesResumable(storageRef, imageFile);

  //     uploadTask.on(
  //       'state_changed',
  //       (snapshot) => {
  //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         setProgressUpload(progress); // to show progress upload
  //         // switch (snapshot.state) {
  //         //   case 'paused':
  //         //     console.log('Upload is paused');
  //         //     break;
  //         //   case 'running':
  //         //     console.log('Upload is running');
  //         //     break;
  //         // }
  //       },
  //       (error) => {
  //         makeToastError(error.message);
  //       },
  //       () => {
  //         getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
  //           console.log(url);
  //           //url is download url of file
  //           //   const data = {
  //           //     userId: session.id,
  //           //     imageUrl: url,
  //           //   };
  //           //   mutation.mutate(data, {
  //           //     onSuccess: (res) => {
  //           //       console.log(res);
  //           //       switch (res.status) {
  //           //         case 200:
  //           //         case 201:
  //           //         case 203:
  //           //           // return (window.location.reload());
  //           //           return ;
  //           //         default:
  //           //           return;
  //           //       }
  //           //     },
  //           //     onSettled: () => {
  //           //       setDialogOpen(false);
  //           //       setIsUploading(false);
  //           //     },
  //           //   });
  //           //   setDownloadURL(url);
  //           //   console.log('downloadUrl', downloadURL);
  //         });
  //       }
  //     );
  //   }
  // };
  const handleRemoveFile = () => setImageFile(undefined);
  // const handleClick = () => {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // };
  return (
    <div>
      <div className={`text-center w-full flex flex-col items-center justify-center ${photoError ? '' : 'mb-4'}`}>
        <span>Choose a course photo</span>
        <span className='text-red text-[13px] text-center w-full text-muted-foreground'>{photoError}</span>
      </div>
      <div className='mt-4'>
        <div className='w-full flex flex-col items-center justify-center'>
          <div className={`flex flex-col h-[200px] w-[200px] relative select-none border shadow-md drop-shadow-md border-gray-200 rounded-full`}>
            <Avatar className='w-full h-full '>
              <div>
                <AvatarImage className={cn('rounded-full  items-end flex', imagePreview ? '' : 'scale-90')} alt='Picture' src={imagePreview ? imagePreview : '/icons/course-photo-placeholder.svg'} onDragStart={(e) => e.preventDefault()} />
                <AvatarFallback className={cn('rounded-full bg-gray-300 bg-opacity-50 flex items-center justify-center')} />
              </div>
            </Avatar>
          </div>
          <input type='file' ref={fileInputRef} style={{ display: 'none' }} accept='image/png' onChange={(e) => handleSelectedFile(e.target.files)} />

          {/* Span that triggers the file input */}
          <Button type='button' onClick={handleClick} disabled={isUploading} className='items-center flex justify-center pl-1'>
            <span className='cursor-pointer  text-blue-600 gap-0 md:gap-2 rounded-md flex items-center'>
              <div className='bg-slate-100 rounded-full'>
                <Icons.add className='h-6 w-6' />
              </div>
              <div className=''>Upload photo</div>
            </span>
          </Button>
        </div>
      </div>
      {/* <div className='w-full flex items-center justify-center'>
          <Button type='submit' autoFocus={false} className='bg-blue-600 w-44 flex-col ' onClick={handleUploadFile} disabled={!isUploading && !imagePreview}>
            <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Save Changes'}</span>
          </Button>
        </div> */}
    </div>
  );
};

export default Photo;
