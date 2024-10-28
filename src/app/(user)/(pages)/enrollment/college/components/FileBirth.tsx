'use client';
import { Icons } from '@/components/shared/Icons';
import { Button } from '@/components/ui/button';
import React, { useRef, useState } from 'react';
import { makeToastError } from '@/lib/toast/makeToast';
import Image from 'next/image';
type IProps = {
  handleSelectedFile: (files: FileList | null) => void;
  handleRemoveFile: () => void;
  handleClick: () => void;
  fileInputRef: any;
  filePreview: any;
  fileError: string;
  isUploading: boolean;
};
const FileBirth = ({ handleSelectedFile,handleRemoveFile, handleClick, fileInputRef, filePreview, fileError, isUploading }: IProps) => {

  return (
    <div className='w-full items-center justify-center'>
      <span className='text-xs sm:text-sm px-2'>PSA Birth Certificate</span>
      {filePreview ? (
        <span className='cursor-pointer pl-1 hover:underline text-blue-600 gap-0 md:gap-2 rounded-md flex items-center'>
          <div className='bg-slate-100 pl-1 rounded-full'>
            <Icons.paperclip className='h-4 w-4' />
          </div>
          <div className=' flex sm:w-[150px] w-full justify-between items-center'>
            <span className='w-[150px] overflow-hidden text-ellipsis whitespace-nowrap'>{filePreview.name}</span>{' '}
            <Button type='button' onClick={handleRemoveFile} disabled={isUploading} className='items-center flex justify-center pl-1'>
              <Icons.close className='h-4 w-4' />
            </Button>
          </div>
        </span>
      ) : (
        <>
          <input type='file' ref={fileInputRef} style={{ display: 'none' }} accept='image/png, image/jpeg, application/pdf' onChange={(e) => handleSelectedFile(e.target.files)} />
          <Button type='button' onClick={handleClick} disabled={isUploading} className='items-center flex justify-center pl-1'>
            <span className='cursor-pointer hover:underline text-blue-600 gap-0 md:gap-2 rounded-md flex items-center'>
              <div className='bg-slate-100 rounded-full'>
                <Icons.add className='h-6 w-6' />
              </div>
              <div className=''>Upload file</div>
            </span>
          </Button>
        </>
      )}
      {fileError && <span className='text-red pl-2 text-sm'>{fileError}</span>}
    </div>
  );
};

export default FileBirth;
