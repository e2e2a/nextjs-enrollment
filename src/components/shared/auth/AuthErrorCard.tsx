import React from 'react';
import CardWrapper from '../CardWrapper';
import { BsExclamationTriangle } from "react-icons/bs";

const AuthErrorCard = () => {
  return (
    <CardWrapper headerLabel="Oops! Something Went Wrong." backButtonLabel="Back to login" backButtonHref="/sign-in">
      <div className="w-full flex justify-center items-center">
        <BsExclamationTriangle className='w-16 h-16 text-red' />
      </div>
    </CardWrapper>
  );
};

export default AuthErrorCard;
