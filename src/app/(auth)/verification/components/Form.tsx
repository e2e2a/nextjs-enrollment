'use client';
import React, { ChangeEvent, createRef, useEffect, useRef, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { handleChange, handlePaste } from '@/hook/verification/VerificationInputEvents';
import { calculateRemainingTime, formatTime } from '@/lib/utils';
import CardWrapper from '@/components/shared/CardWrapper';
import { FormMessageDisplay } from '@/components/shared/FormMessageDisplay';
import { makeToastError } from '@/lib/toast/makeToast';
import { useTokenQueryByParamsToken } from '@/lib/queries/verificationToken';
import { useVerificationcCodeMutation } from '@/lib/queries/verificationToken/code';
import { useResendVCodeMutation } from '@/lib/queries/verificationToken/resend';

const VerificationForm = () => {
  const [message, setMessage] = useState<string | undefined>('');
  const [typeMessage, setTypeMessage] = useState('');
  const [header, setHeader] = useState<string | undefined>('');
  const [labelLink, setLabelLink] = useState<string | undefined>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputCode, setInputCode] = useState<string[]>(Array(6).fill(''));
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);
  const mutationSubmit = useVerificationcCodeMutation();
  const mutationResend = useResendVCodeMutation();
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const { data: result, error } = useTokenQueryByParamsToken(token);
  useEffect(() => {
    if (error) {
      router.push('/recovery');
      return;
    }
    if (result) {
      if (result.error) return router.push('/recovery');
      setHeader('Confirming your verification code');
      setLoading(false);
    }
  }, [result, error, router]);

  useEffect(() => {
    if (inputRefs.current.length !== inputCode.length) {
      inputRefs.current = Array(inputCode.length)
        .fill(null)
        .map((_, i) => inputRefs.current[i] || createRef<HTMLInputElement>());
    }

    if (result && result.token.expiresCode) {
      const initialSeconds = calculateRemainingTime(new Date(result.token.expiresCode));
      setSecondsRemaining(initialSeconds);
    }

    if (secondsRemaining <= 0) {
      setIsPending(true);
      setLabelLink('Resend Verification Code');
      return;
    } else {
      setIsPending(false);
      setLabelLink('');
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [inputCode.length, secondsRemaining, result]);

  const handleSubmit = async () => {
    const verificationCode = inputCode.join('');
    if (verificationCode.length !== 6) return makeToastError('Please complete the verification code.');
    setLoading(true);
    setIsPending(true);
    const data = {
      token: token,
      verificationCode: verificationCode,
    };

    setLabelLink('');
    mutationSubmit.mutate(data, {
      onSuccess: async (res) => {
        if (res.error) return makeToastError(res.error);
        setMessage('Verification completed!');
        setTypeMessage('success');
        if (!res.token) {
          if (res.redirect) {
            return (window.location.href = `${res.redirect}`);
          }
        } else {
          return (window.location.href = `/recovery/reset-password?token=${res.token.token}`);
        }
      },
      onSettled: () => {
        setLoading(false);
        setIsPending(false);
      },
    });
  };

  const onResendCode = async () => {
    setLabelLink('');
    const data = { token: token };
    mutationResend.mutate(data, {
      onSuccess: (res) => {
        if (res.error) {
          setLabelLink('Resend Verification Code');
          makeToastError(res.error);
          return;
        }
        // setTimeout(() => {
        //   window.location.reload();
        // }, 100);
        return;
      },
      onSettled: () => {
        setIsPending(false);
      },
    });
  };
  return (
    <CardWrapper header={'Verification'} headerLabel={header || 'Please double check your token or sign up again.'} backButtonHref='' backButtonLabel={header ? labelLink : ''} onResendCode={onResendCode} className={''}>
      {secondsRemaining !== 0 && !message && (
        <div className='flex items-center justify-center'>
          <div className='text-center rounded-md mb-[3%] sm:text-3xl text-xl font-medium'>{formatTime(secondsRemaining)}</div>
        </div>
      )}
      <div className='flex items-center justify-center sm:p-5 p-0 gap-2 sm:gap-4'>
        {!message && loading && <PulseLoader className='text-sm gap-2 p-5' />}
        {!loading && !message
          ? inputCode.map((value, index) => (
              <Input
                key={index}
                disabled={isPending}
                maxLength={1}
                value={value}
                ref={inputRefs.current[index]}
                className='text-center rounded-md h-16 sm:text-3xl text-xl font-medium'
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value, inputCode, setInputCode, inputRefs)}
                onPaste={(e) => handlePaste(e, inputCode, setInputCode, inputRefs)}
              />
            ))
          : null}
        {message && <FormMessageDisplay message={message} typeMessage={typeMessage} />}
      </div>
      {!message && !loading ? (
        <>
          <p className='text-muted-foreground mt-3 sm:mt-0 text-sm'>• Enter the code from your email address.</p>
          <p className='text-muted-foreground text-sm'>• Do not share your code to anyone.</p>
          <p className='text-muted-foreground mt-3 sm:mt-0 text-sm'>• This link only available for only 24hrs.</p>

          <div className='flex justify-center items-center mt-5'>
            <Button type='submit' disabled={isPending || labelLink == null} className='w-[50%] bg-blue-600 hover:bg-blue-700 text-white' onClick={handleSubmit}>
              Verify
            </Button>
          </div>
        </>
      ) : null}
    </CardWrapper>
  );
};

export default VerificationForm;
