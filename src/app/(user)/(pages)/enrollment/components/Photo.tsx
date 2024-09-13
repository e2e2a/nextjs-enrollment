'use client';
import { Icons } from '@/components/shared/Icons';
import { Button } from '@/components/ui/button';
import React, { useRef, useState } from 'react';
import { makeToastError } from '@/lib/toast/makeToast';
import Image from 'next/image';
type IProps = {
  handleSelectedPhoto: (files: FileList | null) => void;
  handleRemovePhoto: () => void;
  handleClickPhoto: () => void;
  PhotoInputRef: any;
  photoPreview: any;
  photoError: string;
  isUploading: boolean;
};
const Photo = ({ handleSelectedPhoto, handleRemovePhoto, handleClickPhoto, PhotoInputRef, photoPreview, photoError, isUploading }: IProps) => {
  //   const handleRemoveFile = () => setImageFile(undefined);

  return (
    <div className='w-full items-center justify-center'>
      <span className='text-sm px-2'>Student Photo</span>
      {photoPreview ? (
        <span className='cursor-pointer pl-1 hover:underline text-blue-600 gap-0 md:gap-2 rounded-md flex items-center'>
          <div className='bg-slate-100 pl-1 rounded-full'>
            <Icons.media className='h-4 w-4' />
          </div>
          <div className=' flex sm:w-[150px] w-full justify-between items-center'>
            <span className='w-[150px] overflow-hidden text-ellipsis whitespace-nowrap'>{photoPreview.name}</span>{' '}
            <Button type='button' onClick={handleRemovePhoto} disabled={isUploading} className='items-center flex justify-center pl-1'>
              <Icons.close className='h-4 w-4' />
            </Button>
          </div>
        </span>
      ) : (
        <>
          <input type='file' ref={PhotoInputRef} style={{ display: 'none' }} accept='image/png, image/jpeg' onChange={(e) => handleSelectedPhoto(e.target.files)} />
          <Button type='button' onClick={handleClickPhoto} disabled={isUploading} className='items-center flex justify-center pl-1'>
            <span className='cursor-pointer hover:underline text-blue-600 gap-0 md:gap-2 rounded-md flex items-center'>
              <div className='bg-slate-100 rounded-full'>
                <Icons.add className='h-6 w-6' />
              </div>
              <div className=''>Upload file</div>
            </span>
          </Button>
        </>
      )}
      {photoError && <span className='text-red pl-2 text-sm'>{photoError}</span>}
    </div>
  );
};

export default Photo;
