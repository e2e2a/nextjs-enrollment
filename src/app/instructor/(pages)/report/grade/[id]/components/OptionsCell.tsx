import React from 'react';
import { Command, CommandGroup, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import DeleteAlert from './alerts/DeleteAlert';
import UpdateDialog from './dialog/UpdateDialog';

type IProps = {
  user: any;
};

const OptionsCell = ({ user }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  return (
    <div className=''>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className='' asChild>
          <div className='flex justify-center items-center w-full'>
            <Button role='combobox' size={'sm'} className={'w-auto focus-visible:ring-0 flex bg-blue-500 px-2 py-0 text-neutral-50 font-medium'}>
              Options
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent align='center' className='w-[150px] bg-neutral-50 px-1 py-0'>
          <Command>
            <CommandList>
              <CommandGroup className=''>
                <UpdateDialog teacher={user?.teacherId} type={'Approve'} reportGrades={user} />
                <DeleteAlert isUploading={isUploading} setIsOpen={setIsOpen} reportGrades={user} />
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default OptionsCell;
