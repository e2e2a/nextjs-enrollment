import React from 'react';

interface IProps {
  type: string;
  label: string;
  disabled?: boolean;
  classNameInput?: string;
  value: string;
}

const InputDisabled = ({ type, label, disabled, classNameInput, value }: IProps) => {
  return (
    <div className={`relative`}>
      <input
        type={type}
        disabled={disabled}
        value={value}
        className={`${classNameInput} ${
          disabled ? 'cursor-not-allowed bg-slate-200' : 'bg-slate-50'
        } block rounded-xl px-5 pb-2 pt-7 w-full text-sm  border border-gray-200 appearance-nonefocus:outline-none focus:ring-0 focus:border-gray-400 peer pl-4 align-text-bottom`}
        onDragStart={(e) => e.preventDefault()}
        placeholder=''
      />
      <label className='text-black absolute cursor-text text-md select-none text-muted-foreground duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5'>
        {label}
      </label>
    </div>
  );
};

export default InputDisabled;
