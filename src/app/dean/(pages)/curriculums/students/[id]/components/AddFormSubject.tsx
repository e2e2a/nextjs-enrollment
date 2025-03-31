'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { CurriculumSubjectValidator } from '@/lib/validators/AdminValidator';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useUpdateStudentCurriculumLayerSubjectsMutation } from '@/lib/queries/studentCurriculum/update/subjectsFormat';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';

interface IProps {
  curriculum: any;
  s: any;
}

const AddFormSubject = ({ curriculum, s }: IProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<any>({});
  const [selectedItems, setSelectedItems] = useState<string[]>(curriculum?.subjectsFormat?.map((s: any) => s.subjectId?._id) || []);
  const [initialStateSelect, setInitialStateSelect] = useState<string[]>(curriculum?.subjectsFormat?.map((s: any) => s.subjectId?._id) || []);
  const hasChanges = selectedItems.length !== initialStateSelect.length || selectedItems.some((item) => !initialStateSelect.includes(item)) || initialStateSelect.some((item) => !selectedItems.includes(item));
  const mutation = useUpdateStudentCurriculumLayerSubjectsMutation();

  const form = useForm<z.infer<typeof CurriculumSubjectValidator>>({
    resolver: zodResolver(CurriculumSubjectValidator),
    defaultValues: { subjects: [''] },
  });

  useEffect(() => {
    if (s) {
      const filteredSubject = s.filter((s: any) => s.year === curriculum.year && s.semester === curriculum.semester);
      setSubjects(filteredSubject[0].subjectsFormat);
      return;
    }
  }, [s, curriculum]);

  const handleSelect = (subjectId: string) => {
    setSelectedItems((prevSelected) => {
      const updatedSelection = prevSelected.includes(subjectId) ? prevSelected.filter((d) => d !== subjectId) : [...prevSelected, subjectId];
      return updatedSelection.sort((a, b) => subjectId?.indexOf(a) - subjectId?.indexOf(b));
    });
  };

  const handleRemove = (subjectId: string) => {
    setSelectedItems((prevSelected) => {
      const updatedSelection = prevSelected.filter((d) => d !== subjectId);
      return updatedSelection;
    });
  };

  useEffect(() => {
    form.setValue('subjects', selectedItems);
  }, [selectedItems, form]);

  const actionFormSubmit = (data: z.infer<typeof CurriculumSubjectValidator>) => {
    setIsPending(true);
    const dataa = { ...data, id: curriculum._id };
    mutation.mutate(dataa, {
      onSuccess: (res: any) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setIsOpen(false);
            makeToastSucess(res.message);
            return;
          default:
            makeToastError(res.error);
            return;
        }
      },
      onSettled: () => {
        setIsPending(false);
      },
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'sm'} className={'w-full group focus-visible:ring-0 flex my-1 text-black bg-transparent hover:bg-blue-600 px-2 py-0 gap-x-1 justify-start items-center hover:text-neutral-50 font-medium'}>
          <Icons.squarePen className='h-4 w-4' />
          <span className='flex'>Edit Subjects</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-6xl w-full bg-white focus-visible:ring-0 ' onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='flex flex-col space-y-1'>
            <span>Add New Curriculum Subject</span>
          </DialogTitle>
          <DialogDescription className=''>Selection of subjects.</DialogDescription>
        </DialogHeader>
        <div className=''>
          <div className={`flex  ${selectedItems.length === 0 ? 'w-full justify-end' : 'justify-between'}`}>
            {selectedItems.length > 0 && subjects && Array.isArray(subjects) && (
              <span className=''>
                Add list:
                <div className='flex flex-col'>
                  {selectedItems.map((value) => {
                    const selectedItem = subjects.find((item: any) => item.subjectId?._id === value);
                    return selectedItem ? (
                      <span key={selectedItem.subjectId?._id} className='text-green-500 flex items-center gap-3'>
                        • {selectedItem.subjectId?.name}
                        <span className='text-red cursor-pointer' onClick={() => handleRemove(selectedItem.subjectId?._id)}>
                          <Icons.trash className='h-3 w-3' />
                        </span>
                      </span>
                    ) : null;
                  })}
                </div>
              </span>
            )}
            {hasChanges && (
              <Button type='submit' disabled={isPending} className='bg-blue-600 text-neutral-50' size={'sm'} onClick={form.handleSubmit(actionFormSubmit)} variant='secondary'>
                Save
              </Button>
            )}
          </div>
        </div>
        <div className='overflow-auto w-full bg-slate-50 rounded-lg'>
          <Form {...form}>
            <form action='' method='post' className='gap-4 flex flex-col'>
              <FormField
                control={form.control}
                name={'subjects'}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Command className='w-full'>
                        <CommandInput placeholder='Search Descriptive Title...' />
                        <CommandList className='w-full'>
                          <CommandEmpty>No Descriptive Title found.</CommandEmpty>
                          <CommandGroup className='w-full'>
                            <div className='overflow-x-auto w-full hidden lg:flex'>
                              <div className=' bg-white border border-gray-300'>
                                <div className='flex items-center text-xs bg-gray-200'>
                                  <span className='w-[150px]  flex justify-center'>Actions</span>
                                  <span className='w-[150px] '>Course Code</span>
                                  <span className='w-[150px] '>Descriptive Name</span>
                                  <span className='w-[150px] flex justify-center'>Pre. Req.</span>
                                  <span className='w-[150px] flex justify-center'>Lec</span>
                                  <span className='w-[150px] flex justify-center'>Lab</span>
                                  <span className='w-[150px] flex justify-center'>Total Unit/s</span>
                                </div>
                                {subjects.map((item: any, index: any) => (
                                  <CommandItem className='border w-full block' key={item.subjectId?._id} value={item.subjectId?.name}>
                                    <div className='flex w-full'>
                                      <div className='sm:min-w-[140px] lg:min-w-[145px] justify-center flex items-center'>
                                        {selectedItems.includes(item.subjectId?._id) ? (
                                          <Button
                                            onClick={() => handleSelect(item.subjectId?._id)}
                                            disabled={isPending}
                                            type='button'
                                            size={'sm'}
                                            className={'focus-visible:ring-0 flex mb-7 bg-transparent bg-red px-2 py-0 gap-x-0 sm:gap-x-1 justify-center  text-neutral-50 font-medium'}
                                          >
                                            <Icons.trash className='h-4 w-4' />
                                          </Button>
                                        ) : (
                                          <Button
                                            onClick={() => handleSelect(item.subjectId?._id)}
                                            disabled={isPending}
                                            type='button'
                                            size={'sm'}
                                            className={'focus-visible:ring-0 flex mb-7 bg-transparent bg-green-500 px-2 py-0 gap-x-0 sm:gap-x-1 justify-center  text-neutral-50 font-medium'}
                                          >
                                            <Icons.add className='h-4 w-4' />
                                            <span className='sm:flex hidden text-xs sm:text-sm'>Add</span>
                                          </Button>
                                        )}
                                      </div>
                                      <span className='w-[150px]'>{item?.subjectId?.subjectCode}</span>
                                      <span className='w-[150px] text-wrap'>{item?.subjectId?.name}</span>
                                      <span className='w-[150px] flex justify-center'>{item?.subjectId?.preReq ?? ''}</span>
                                      <span className='w-[150px] flex justify-center'>{item?.subjectId?.lec}</span>
                                      <span className='w-[150px] flex justify-center'>{item?.subjectId?.lab}</span>
                                      <span className='w-[150px] flex justify-center'>{item?.subjectId?.unit}</span>
                                    </div>
                                  </CommandItem>
                                ))}
                              </div>
                            </div>
                            <div className='flex flex-col gap-y-6 lg:hidden'>
                              {subjects.map((item: any, index: any) => (
                                <CommandItem className='border w-full block' key={item.subjectId?._id} value={item.subjectId?.name}>
                                  <div className='flex flex-col w-full '>
                                    <div className='flex items-center justify-end bg-gray-200 border border-neutral-50'>
                                      {selectedItems.includes(item.subjectId?._id) ? (
                                        <Button onClick={() => handleSelect(item.subjectId?._id)} type='button' size={'sm'} className={'focus-visible:ring-0 flex bg-transparent bg-red px-2 py-0 gap-x-0 sm:gap-x-1 justify-center  text-neutral-50 font-medium'}>
                                          <Icons.trash className='h-4 w-4' />
                                          <span className='sm:flex hidden text-xs sm:text-sm'>Remove</span>
                                        </Button>
                                      ) : (
                                        <Button
                                          onClick={() => handleSelect(item.subjectId?._id)}
                                          disabled={isPending}
                                          type='button'
                                          size={'sm'}
                                          className={'focus-visible:ring-0 flex bg-transparent bg-green-500 px-2 py-0 gap-x-0 sm:gap-x-1 justify-center  text-neutral-50 font-medium'}
                                        >
                                          <Icons.add className='h-4 w-4' />
                                          <span className='sm:flex hidden text-xs sm:text-sm'>Add</span>
                                        </Button>
                                      )}
                                    </div>
                                    <span className='bg-gray-200 border border-neutral-50 pl-3'>Subject Code: {item?.subjectId?.subjectCode}</span>
                                    <span className='bg-gray-200 border border-neutral-50 pl-3'>Descriptive Title: {item?.subjectId?.name}</span>
                                    <span className='bg-gray-200 border border-neutral-50 pl-3'>Pre Req.: {item?.subjectId?.preReq ?? ''}</span>
                                    <span className='bg-gray-200 border border-neutral-50 pl-3'>Lec: {item?.subjectId?.lec}</span>
                                    <span className='bg-gray-200 border border-neutral-50 pl-3'>Lab: {item?.subjectId?.lab}</span>
                                    <span className='bg-gray-200 border border-neutral-50 pl-3'>Unit: {item?.subjectId?.unit}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </div>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </FormControl>
                    <FormMessage className='text-red pl-2' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFormSubject;
