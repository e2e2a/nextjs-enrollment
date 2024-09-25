'use client';
import { Icons } from '@/components/shared/Icons';
import { Button } from '@/components/ui/button';
import React from 'react';
type IProps = {
  handleSelectedFileTOR: (files: FileList | null) => void;
  handleRemoveFileTOR: () => void;
  handleClickFileTOR: () => void;
  fileTORInputRef: any;
  fileTORPreview: any;
  fileTORError: string;
  isUploading: boolean;
};
const EditReportCardFile = ({ handleSelectedFileTOR, handleRemoveFileTOR, handleClickFileTOR, fileTORInputRef, fileTORPreview, fileTORError, isUploading }: IProps) => {
  return (
    <div className='w-full items-center justify-center'>
      <span className='text-xs sm:text-sm px-2'>Report Card (Form 138)/Informative copy of TOR</span>
      {fileTORPreview ? (
        <span className='cursor-pointer pl-1 hover:underline text-blue-600 gap-0 md:gap-2 rounded-md flex items-center'>
          <div className='bg-slate-100 pl-1 rounded-full'>
            <Icons.paperclip className='h-4 w-4' />
          </div>
          <div className=' flex sm:w-[150px] w-full justify-between items-center'>
            <span className='w-[150px] overflow-hidden text-ellipsis whitespace-nowrap'>{fileTORPreview.name}</span>{' '}
            <Button type='button' onClick={handleRemoveFileTOR} disabled={isUploading} className='items-center flex justify-center pl-1'>
              <Icons.close className='h-4 w-4' />
            </Button>
          </div>
        </span>
      ) : (
        <>
          <input type='file' ref={fileTORInputRef} style={{ display: 'none' }} accept='image/png, image/jpeg, application/pdf' onChange={(e) => handleSelectedFileTOR(e.target.files)} />
          <Button type='button' onClick={handleClickFileTOR} disabled={isUploading} className='items-center flex justify-center pl-1'>
            <span className='cursor-pointer hover:underline text-blue-600 gap-0 md:gap-2 rounded-md flex items-center'>
              <div className='bg-slate-100 rounded-full'>
                <Icons.add className='h-6 w-6' />
              </div>
              <div className=''>Upload file</div>
            </span>
          </Button>
        </>
      )}
      {fileTORError && <span className='text-red pl-2 text-sm'>{fileTORError}</span>}
    </div>
  );
};

export default EditReportCardFile;
