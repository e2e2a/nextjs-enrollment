'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import Input from '../../Input';
import PSAFile from '../../PSAFile';
import GoodMoralFile from '../../GoodMoralFile';
import ReportCardFile from '../../ReportCardFile';
import StudentPhoto from '../../StudentPhoto';
import { makeToastError } from '@/lib/toast/makeToast';
import EditPSAFile from '../../edit/EditPSAFile';
import EditGoodMoralFile from '../../edit/EditGoodMoralFile';
import EditReportCardFile from '../../edit/EditReportCardFile';
import EditStudentPhoto from '../../edit/EditStudentPhoto';
import Link from 'next/link';
import { useEnrollmentQueryByProfileId } from '@/lib/queries/enrollment/get/profileId';
import LoaderPage from '@/components/shared/LoaderPage';

type Iprops = {
  form: any;
  profile: any;
  isNotEditable: boolean;
  photoPreview: any;
  filePreview: any;
  fileGoodMoralPreview: any;
  fileTORPreview: any;
  setPhotoPreview: React.Dispatch<React.SetStateAction<File | null>>;
  setFilePreview: React.Dispatch<React.SetStateAction<File | null>>;
  setFileGoodMoralPreview: React.Dispatch<React.SetStateAction<File | null>>;
  setFileTORPreview: React.Dispatch<React.SetStateAction<File | null>>;
};

const ExtensionData = ({ form, profile, isNotEditable, photoPreview, filePreview, fileGoodMoralPreview, fileTORPreview, setPhotoPreview, setFilePreview, setFileGoodMoralPreview, setFileTORPreview }: Iprops) => {
  const [photoError, setPhotoError] = useState('');
  const PhotoInputRef = useRef<HTMLInputElement>(null);

  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileGoodMoralError, setFileGoodMoralError] = useState('');
  const fileGoodMoralInputRef = useRef<HTMLInputElement>(null);

  const [fileTORError, setTORError] = useState('');
  const fileTORInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  // const mutation = useStudentProfileMutation();

  const handleSelectedPhoto = (files: FileList | null) => {
    if (files && files?.length > 0) {
      if (files[0].size < 5000000) {
        if (files[0].type === 'image/jpeg' || files[0].type === 'image/png') {
          setPhotoError('');
          const file = files[0];
          setPhotoPreview(file);
        } else {
          makeToastError('Student Photo Only allowed JPEG and PNG files.');
        }
      } else {
        makeToastError('File size too large');
      }
    }
  };
  const handleSelectedFile = (files: FileList | null) => {
    if (files && files?.length > 0) {
      if (files[0].size < 5000000) {
        if (files[0].type === 'image/jpeg' || files[0].type === 'image/png' || files[0].type === 'application/pdf') {
          setFileError('');
          const file = files[0];
          setFilePreview(file);
        } else {
          makeToastError('PSA file Only allowed JPEG, PNG and PDF files.');
        }
      } else {
        makeToastError('File size too large');
      }
    }
  };
  const handleSelectedFileGoodMoral = (files: FileList | null) => {
    if (files && files?.length > 0) {
      if (files[0].size < 5000000) {
        if (files[0].type === 'image/jpeg' || files[0].type === 'image/png' || files[0].type === 'application/pdf') {
          setFileGoodMoralError('');
          const file = files[0];
          setFileGoodMoralPreview(file);
        } else {
          makeToastError('Good Moral Only allowed JPEG, PNG and PDF files.');
        }
      } else {
        makeToastError('File size too large');
      }
    }
  };
  const handleSelectedFileTOR = (files: FileList | null) => {
    if (files && files?.length > 0) {
      if (files[0].size < 5000000) {
        if (files[0].type === 'image/jpeg' || files[0].type === 'image/png' || files[0].type === 'application/pdf') {
          setTORError('');
          const file = files[0];
          setFileTORPreview(file);
        } else {
          makeToastError('Form 138/137 Only allowed JPEG, PNG and PDF files.');
        }
      } else {
        makeToastError('File size too large');
      }
    }
  };
  const handleClickPhoto = () => {
    if (PhotoInputRef.current) {
      PhotoInputRef.current.click();
    }
  };
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleClickFileGoodMoral = () => {
    if (fileGoodMoralInputRef.current) {
      fileGoodMoralInputRef.current.click();
    }
  };
  const handleClickFileTOR = () => {
    if (fileTORInputRef.current) {
      fileTORInputRef.current.click();
    }
  };
  const handleRemovePhoto = () => setPhotoPreview(null);
  const handleRemoveFile = () => setFilePreview(null);
  const handleRemoveFileGoodMoral = () => setFileGoodMoralPreview(null);
  const handleRemoveFileTOR = () => setFileTORPreview(null);

  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const hasEnrollment = profile && (profile.enrollStatus === 'Enrolled' || profile.enrollStatus === 'Pending' || profile.enrollStatus === 'Temporary Enrolled');
  const { data, isLoading, error } = useEnrollmentQueryByProfileId(profile._id, !!hasEnrollment);

  useEffect(() => {
    if (!hasEnrollment) return setIsPageLoading(false);
    if (!data || error) return;

    if (data) {
      if (data.enrollment) {
        return setIsPageLoading(false);
      }
    }
  }, [data, error, hasEnrollment, profile]);

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <div>
          <h1 className='text-lg sm:text-xl font-bold text-center mt-7'>Additional Information for Student Enrolling/Enrolled </h1>

          <h1 className='text-sm sm:text-[18px] font-medium border-b text-center mb-4 flex flex-col'>
            <div className='flex flex-col'>
              <div className=''>
                Applicant in: <span className='text-green-500'>{profile.courseId.category}</span>
              </div>
              <div className=''>
                Enrollment Status:
                {profile.enrollStatus === 'Pending' && <span className='font-normal text-blue-500'>{profile.enrollStatus}</span>}
                {profile.enrollStatus === 'Enrolled' && <span className='font-normal text-green-500'>{profile.enrollStatus}</span>}
                {profile.enrollStatus === 'Temporary Enrolled' && <span className='font-normal text-orange-500'>{profile.enrollStatus}</span>}
                {profile.enrollStatus === 'Rejected' && <span className='font-normal text-red'>{profile.enrollStatus}</span>}
              </div>
              <div className=''>
                Department: <span className='text-green-500 capitalize'>{profile.courseId.name}</span>
              </div>
            </div>
            <div className='text-sm font-normal flex w-full justify-center items-center'>
              <Link href={`/dean/enrollment/schedules/${data?.enrollment?._id}`} className='hover:underline hover:text-blue-600 text-blue-500 space-y-2'>
                <Button size={'sm'} type='button' className='w-auto flex gap-2'>
                  {' '}
                  View Enrollment Info 👉{' '}
                </Button>
              </Link>
            </div>
          </h1>
          {isNotEditable ? (
            <>
              <div className='grid lg:grid-cols-4 sm:grid-cols-2'>
                <div className='grid grid-cols-1'>
                  <div className=''>Student Photo</div>
                  <StudentPhoto user={profile} />
                </div>
                <div className='grid grid-cols-1'>
                  <div className=''>PSA Birth Certificate</div>
                  <PSAFile user={profile} />
                </div>
                <div className='grid grid-cols-1'>
                  <div className=''>Good Moral</div>
                  <GoodMoralFile user={profile} />
                </div>
                <div className='grid grid-cols-1'>
                  <div className=''>Report Card (Form 138)/Informative copy of TOR</div>
                  <ReportCardFile user={profile} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className='flex flex-col mt-5 mb-3'>
                <div className='font-medium text-[16px] text-orange-500'>Note </div>
                <div className=''>You may leave the file or photo field empty if you do not wish to update it at this time. The current file or photo will remain unchanged.</div>
              </div>
              <div className='grid grid-cols-1 xs:grid-cols-2 w-full gap-5'>
                <EditPSAFile handleSelectedFile={handleSelectedFile} handleRemoveFile={handleRemoveFile} handleClick={handleClick} fileInputRef={fileInputRef} filePreview={filePreview} fileError={fileError} isUploading={isUploading} />
                <EditStudentPhoto handleSelectedPhoto={handleSelectedPhoto} handleRemovePhoto={handleRemovePhoto} handleClickPhoto={handleClickPhoto} PhotoInputRef={PhotoInputRef} photoPreview={photoPreview} photoError={photoError} isUploading={isUploading} />
                <EditGoodMoralFile
                  handleSelectedFileGoodMoral={handleSelectedFileGoodMoral}
                  handleRemoveFileGoodMoral={handleRemoveFileGoodMoral}
                  handleClickFileGoodMoral={handleClickFileGoodMoral}
                  fileGoodMoralInputRef={fileGoodMoralInputRef}
                  fileGoodMoralPreview={fileGoodMoralPreview}
                  fileGoodMoralError={fileGoodMoralError}
                  isUploading={isUploading}
                />
                <EditReportCardFile
                  handleSelectedFileTOR={handleSelectedFileTOR}
                  handleRemoveFileTOR={handleRemoveFileTOR}
                  handleClickFileTOR={handleClickFileTOR}
                  fileTORInputRef={fileTORInputRef}
                  fileTORPreview={fileTORPreview}
                  fileTORError={fileTORError}
                  isUploading={isUploading}
                />
              </div>
            </>
          )}
          <div className='mb-5 lg:mb-0'>
            <h1 className='text-lg font-bold border-b text-left'>Educational Background</h1>
            <div className={`space-y-3 mt-2 mb-3`}>
              <Input isNotEditable={isNotEditable} name={'primarySchoolName'} type={'text'} form={form} label={'Primary School Name:'} classNameInput={'capitalize'} />
              <Input isNotEditable={isNotEditable} name={'primarySchoolYear'} type={'text'} form={form} label={'Year Graduated:'} classNameInput={'capitalize'} />
              <Input isNotEditable={isNotEditable} name={'secondarySchoolName'} type={'text'} form={form} label={'Secondary School Name:'} classNameInput={'capitalize'} />
              <Input isNotEditable={isNotEditable} name={'secondarySchoolYear'} type={'text'} form={form} label={'Year Graduated:'} classNameInput={'capitalize'} />
              <Input isNotEditable={isNotEditable} name={'seniorHighSchoolName'} type={'text'} form={form} label={'Senior High School Name:'} classNameInput={'capitalize'} />
              <Input isNotEditable={isNotEditable} name={'seniorHighSchoolYear'} type={'text'} form={form} label={'Year Graduated:'} />
              <Input isNotEditable={isNotEditable} name={'seniorHighSchoolStrand'} type={'text'} form={form} label={'Strand:'} />
            </div>
          </div>
          <div className='mb-5 lg:mb-0'>
            <h1 className='text-lg font-bold border-b text-left'>Parent&apos;s Information</h1>
            <div className={`space-y-3 mt-2 mb-3`}>
              <Input isNotEditable={isNotEditable} label={`Father's Last Name:`} type={'text'} form={form} name={'FathersLastName'} classNameInput={'capitalize'} />
              <Input isNotEditable={isNotEditable} label={`Father's First Name:`} type={'text'} form={form} name={'FathersFirstName'} classNameInput={'capitalize'} />
              <Input isNotEditable={isNotEditable} label={`Father's Middle Name:`} type={'text'} form={form} name={'FathersMiddleName'} classNameInput={'capitalize'} />
              <Input isNotEditable={isNotEditable} label={`Father's Contact Number:`} type={'text'} form={form} name={'FathersContact'} classNameInput={'capitalize'} />
              <Input isNotEditable={isNotEditable} label={`Mother's Last Name:`} type={'text'} form={form} name={'MothersLastName'} classNameInput={'capitalize'} />
              <Input isNotEditable={isNotEditable} label={`Mother's First Name:`} type={'text'} form={form} name={'MothersFirstName'} />
              <Input isNotEditable={isNotEditable} label={`Mother's Middle Name:`} type={'text'} form={form} name={'MothersMiddleName'} />
              <Input isNotEditable={isNotEditable} label={`Mother's Contact Number:`} type={'text'} form={form} name={'MothersContact'} classNameInput={'capitalize'} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExtensionData;
