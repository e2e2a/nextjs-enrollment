import { Input } from '@/components/ui/input';
import React from 'react';

type IProps = {
  setAmountInput: any;
  amountInput: any;
};

const InputAmount = ({ setAmountInput, amountInput }: IProps) => {
  return (
    <div className='grid grid-cols-1 gap-4 w-full'>
      <div className={`relative`}>
        <input
          type={'text'}
          id={'amount'}
          className={`uppercase block rounded-xl px-5 pb-2 pt-7 w-full text-sm bg-slate-50 border border-gray-200 appearance-nonefocus:outline-none focus:ring-0 focus:border-gray-400 peer pl-4 align-text-bottom`}
          onDragStart={(e) => e.preventDefault()}
          value={Number(amountInput).toFixed(2)}
          onChange={(e) => setAmountInput(parseFloat(e.target.value) || 0)}
          placeholder='0.00'
        />
        <label
          htmlFor={'amount'}
          className='text-black absolute cursor-text text-md select-none text-muted-foreground duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5'
        >
          Amount
        </label>
      </div>
    </div>
  );
};

export default InputAmount;
