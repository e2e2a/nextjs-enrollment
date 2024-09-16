'use client';
import * as React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IProps {
  name: string;
  form: any;
  label: string;
  selectItems: any;
  placeholder: string;
}
const dayOrder = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su']; // Standard day order
export function ComboboxDays({ form, name, label, selectItems, placeholder }: IProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  // const handleSelect = (day: string) => {
  //   setSelectedItems((prevSelected) => {
  //     const updatedSelection = prevSelected.includes(day)
  //       ? prevSelected.filter((d) => d !== day) // Remove if already selected
  //       : [...prevSelected, day]; // Add if not selected

  //     // Sort the selected days according to the standard day order
  //     return updatedSelection.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
  //   });
  // };
  React.useEffect(() => {
    form.setValue(name, selectedItems);
  }, [selectedItems, form, name]);

  const handleSelect = (day: string) => {
    setSelectedItems((prevSelected) => {
      const updatedSelection = prevSelected.includes(day)
        ? prevSelected.filter((d) => d !== day) // Remove if already selected
        : [...prevSelected, day]; // Add if not selected

      // Sort the selected days according to the standard day order
      return updatedSelection.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
    });
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className='relative bg-slate-50 rounded-lg'>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild className='w-full pt-10 pb-4 text-left text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'>
                  <Button variant='outline' role='combobox' aria-expanded={open} className='w-full font-normal justify-between' onClick={() => setOpen(!open)}>
                    {/* Display the selected days or placeholder */}
                    {/* {selectedItems.length > 0 ? selectedItems.map((value) => selectItems.find((item: any) => item.value === value)?.label).join(', ') : placeholder} */}
                    {field.value && field.value.length > 0 ? field.value.map((value: string) => selectItems.find((item: any) => item.value === value)?.label).join(', ') : placeholder}
                    <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align='start' className='w-full p-0 bg-white border-gray-300'>
                  <Command className='w-full'>
                    <CommandInput placeholder='Search Days...' />
                    <CommandList>
                      <CommandEmpty>No days found.</CommandEmpty>
                      <CommandGroup>
                        {selectItems.map((item: any) => (
                          <CommandItem
                            key={item.value}
                            onSelect={() => handleSelect(item.value)}
                            // onSelect={() => {
                            //   handleSelect(item.value);
                            //   field.onChange(selectedItems);
                            // }}
                          >
                            <Check className={cn('mr-2 h-4 w-4', field.value.includes(item.value) ? 'opacity-100' : 'opacity-0')} />
                            {item.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <label
                htmlFor={name}
                className={`pointer-events-none bg-transparent absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5`}
              >
                {label}
              </label>
            </div>
          </FormControl>
          <FormMessage className='text-red pl-2' />
        </FormItem>
      )}
    />
  );
}
