import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
    setRegMiscRows([...regMiscRows, { name: '', amount: '' }]);
  };

  // Handle input change in the dynamic table rows
  const handleInputChange = (index: number, field: any, value: any) => {
    const updatedRows = [...regMiscRows];
    updatedRows[index][field] = value;
    setRegMiscRows(updatedRows);
  };

  return (
    <div>
      <CardContent className='w-full'>
        <div className='overflow-x-auto'>
          <table className='min-w-full table-auto'>
            <thead>
              <tr>
                <th className='px-4 py-2 text-left'>Name</th>
                <th className='px-4 py-2 text-left'>Amount</th>
                <th className='px-4 py-2'>
                  <Button type='button' onClick={handleAddRow} variant='destructive' className='bg-green-500 hover:bg-green-700 text-white'>
                    Add Row
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {regMiscRows.map((row: any, index: any) => (
                <tr key={index}>
                  <td className='px-4 py-2'>
                    <Input
                      type='text'
                      value={row.name} // Type-safe value
                      onChange={(e) => handleInputChange(index, 'name', e.target.value)} // Type-safe handler
                      placeholder='Name'
                    />
                  </td>
                  <td className='px-4 py-2'>
                    <Input
                      type='text'
                      value={row.amount} // Type-safe value
                      onChange={(e) => handleInputChange(index, 'amount', e.target.value)} // Type-safe handler
                      placeholder='Amount'
                    />
                  </td>
                  <td className='px-4 py-2 hover:text-white'>
                    <Button type='button' onClick={() => handleDeleteRow(index)} variant='destructive' className='bg-red hover:opacity-85 text-white'>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </div>
  );
};

export default RegOrMisc;
