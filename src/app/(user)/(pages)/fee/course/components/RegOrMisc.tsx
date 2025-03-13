'use client';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';

interface IProps {
  regMiscRows: any[];
  setRegMiscRows: React.Dispatch<React.SetStateAction<any[]>>;
}

const RegOrMisc = ({ regMiscRows, setRegMiscRows }: IProps) => {
  // Handle deleting a new row
  const handleDeleteRow = (index: number) => {
    setRegMiscRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  // Handle adding a new row
  const handleAddRow = () => {
    setRegMiscRows([...regMiscRows, { type: '', name: '', amount: '' }]);
  };

  // Handle input change in the dynamic table rows
  const handleInputChange = (index: number, field: any, value: any) => {
    const updatedRows = [...regMiscRows];
    updatedRows[index][field] = value;
    setRegMiscRows(updatedRows);
  };

  return (
    <>
      <div>
        <CardContent className='w-full'>
          <div className=''>
            <h1 className='text-lg font-semibold xs:text-xl sm:text-2xl tracking-tight w-full text-start uppercase'>Reg/Misc Fee</h1>
          </div>
          <div className='overflow-x-auto mt-3 rounded-t-lg'>
            <Table className='table-auto border-collapse rounded-t-lg border '>
              <TableHeader>
                <TableRow className=' border-black rounded-t-lg bg-gray-200 font-bold text-[16px]'>
                  <TableHead className='px-4 py-2 text-left'>Type</TableHead>
                  <TableHead className='px-4 py-2 text-left'>Name</TableHead>
                  <TableHead className='px-4 py-2 text-left'>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regMiscRows.map((row: any, index: any) => (
                  <TableRow key={index}>
                    <TableCell className='px-4 py-2'>{row.type}</TableCell>
                    <TableCell className='px-4 py-2'>{row.name}</TableCell>
                    <TableCell className='px-4 py-2'>{Number(row?.amount).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </div>
    </>
  );
};

export default RegOrMisc;
