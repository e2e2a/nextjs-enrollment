import React from 'react';

export const handleChange = (
  index: number,
  value: string,
  inputCode: string[],
  setInputCode: React.Dispatch<React.SetStateAction<string[]>>,
  inputRefs: React.MutableRefObject<React.RefObject<HTMLInputElement>[]>
) => {
  const uppercaseValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const newCode = [...inputCode];
  newCode[index] = uppercaseValue;

  if (uppercaseValue.length === 1 && index < inputCode.length - 1) {
    const nextInput = inputRefs.current[index + 1];
    nextInput?.current?.focus();
  }

  setInputCode(newCode);
};

export const handlePaste = (
  e: React.ClipboardEvent<HTMLInputElement>,
  inputCode: string[],
  setInputCode: React.Dispatch<React.SetStateAction<string[]>>,
  inputRefs: React.MutableRefObject<React.RefObject<HTMLInputElement>[]>
) => {
  const pasteData = e.clipboardData
    .getData('Text')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  if (pasteData.length === inputCode.length) {
    const newCode = pasteData.split('');
    setInputCode(newCode);

    newCode.forEach((char, index) => {
      const input = inputRefs.current[index];
      if (input && input.current) {
        input.current.value = char;
      }
    });

    const lastInput = inputRefs.current[newCode.length - 1];
    lastInput?.current?.focus();
  }
};
