'use client';
import { Icons } from '@/components/shared/Icons';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type IProps = {
  handleSelectedFile: (files: FileList | null) => void;
  handleClick: () => void;
  fileInputRef: any;
  imagePreview: any;
  photoError: string;
  isUploading: boolean;
};

const Photo = ({ handleSelectedFile, handleClick, fileInputRef, imagePreview, photoError, isUploading }: IProps) => {
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

          <Button type='button' onClick={handleClick} disabled={isUploading} className='items-center flex justify-center pl-1'>
            <span className='cursor-pointer  text-blue-600 gap-0 md:gap-2 rounded-md flex items-center'>
              <div className='bg-slate-100 rounded-full'>
                <Icons.add className='h-6 w-6' />
              </div>
              <div className=''>Upload new photo</div>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Photo;
