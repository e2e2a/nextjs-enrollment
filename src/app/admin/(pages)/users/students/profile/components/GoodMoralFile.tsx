'use client';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { fireAuth, storage } from '@/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { signInWithEmailAndPassword } from 'firebase/auth';

const GoodMoralFile = ({ user }: { user: any }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const fetchFileUrl = async () => {
      try {
        if(!user.goodMoralUrl) return
        const filePath = `enrollment/goodMoral/${user._id}/${user.goodMoralUrl}`;
        // if(!fireAuth.currentUser) await signInWithEmailAndPassword(fireAuth, 'admin@gmail.com', 'qweqwe')
        const fileRef = ref(storage, filePath);

        const url = await getDownloadURL(fileRef);
        setFileUrl(url);
      } catch (error) {
        console.error('Error fetching file URL: ', error);
      }
    };
    fetchFileUrl();
  }, [user, fileUrl]);
  return (
    <>
      {user ? (
        <div className='items-center justify-center '>
          <Button type='button' onClick={() => setIsOpen(true)} className='text-sm hover:underline text-blue-600'>
            Open
          </Button>

          {/* Dialog to show enlarged image */}
          <Dialog open={isOpen} modal={false} onOpenChange={setIsOpen}>
            <DialogContent className='max-w-xl bg-white w-full py-10 '>
              <DialogHeader>
                <DialogTitle className='flex flex-col space-y-1'>
                  <span>PSA file</span>
                  <span className='font-medium sm:text-lg text-xs'>
                    Student:{' '}
                    <span className=' capitalize sm:text-lg text-xs'>
                      {user.firstname} {user.middlename[0] + '.'} {user.lastname} {user.extensionName ? user.extensionName : ''}
                    </span>
                  </span>
                </DialogTitle>
                <DialogDescription className='hidden'>asdasd</DialogDescription>
              </DialogHeader>
              <div className='overflow-y-auto max-h-[400px] '>
                {fileUrl ? (
                  fileUrl.includes('.pdf') ? (
                    <iframe src={fileUrl} width='100%' height='400px' className='border-0' title='PDF Preview' />
                  ) : (
                    <Image src={fileUrl} alt={user.firstname || 'nothing to say'} width={600} priority height={600} className='object-contain' />
                  )
                ) : <div className='items-center justify-center text-red'>No Good Moral File</div>}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className='items-center justify-center text-red'>No Good Moral File</div>
      )}
    </>
  );
};

export default GoodMoralFile;
