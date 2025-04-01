import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import React, { useState, useRef } from 'react';

interface IProps {
  name: string;
  type: string;
  form: any;
  label: string;
  list: any[]; // Ensure list is an array of objects with a title property
  classNameInput?: string;
}

const InputList = ({ name, type, form, label, list, classNameInput }: IProps) => {
  const [filteredList, setFilteredList] = useState(list);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    form.setValue(name, value); // Update form value

    // Filter list based on input
    if (value) {
      setFilteredList(list.filter((item) => item.title.toLowerCase().includes(value.toLowerCase())));
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleLabelClick = () => {
    const inputElement = document.getElementById(name) as HTMLInputElement;
    if (inputElement) {
      inputElement.focus(); // Focus input on label click
      setShowDropdown(true);
    }
  };

  const handleSelectItem = (item: string) => {
    form.setValue(name, item);
    setShowDropdown(false);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="relative">
          <FormControl>
            <div className="relative">
              <input
                {...field} // Use field.ref for handling ref
                type={type}
                id={name}
                autoComplete="off"
                className={`${classNameInput} block rounded-xl px-5 pb-2 pt-7 w-full text-sm bg-slate-50 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-400 peer pl-4`}
                onDragStart={(e) => e.preventDefault()}
                placeholder=""
                onChange={handleInputChange}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Delay for selecting dropdown
              />
              <label
                htmlFor={name}
                onClick={handleLabelClick} // Click label to focus and show dropdown
                className="text-black absolute cursor-text text-md select-none text-muted-foreground duration-200 transform -translate-y-2.5 scale-75 top-4 left-4 z-10 origin-[0] peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5"
              >
                {label}
              </label>

              {/* Custom Dropdown List */}
              {showDropdown && filteredList.length > 0 && (
                <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-50 max-h-40 overflow-y-auto">
                  {filteredList.map((item, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-200"
                      onMouseDown={() => handleSelectItem(item.title)}
                    >
                      {item.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </FormControl>
          <FormMessage className="text-red pl-2" />
        </FormItem>
      )}
    />
  );
};

export default InputList;
