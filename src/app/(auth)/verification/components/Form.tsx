'use client';
import React, { ChangeEvent, createRef, useCallback, useEffect, useRef, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { handleChange, handlePaste } from '@/hook/verification/VerificationInputEvents';
import { makeToastError } from '@/lib/helpers/makeToast';
import { calculateRemainingTime, formatTime } from '@/lib/utils';
import { useResendVCodeMutation, useTokenCheckQuery, useVerificationcCodeMutation } from '@/lib/queries';
import CardWrapper from '@/components/shared/CardWrapper';
import { FormMessageDisplay } from '@/components/shared/FormMessageDisplay';
interface IResult {
  result?: {
    error: string;
    success: string;
    existingToken: {
      id: string;
      email: string;
      token: string;
      code: string;
      tokenType: string;
      expires: Date;
      expiresCode: Date;
    };
  };
}

const VerificationForm = () => {
  const [message, setMessage] = useState<string | undefined>('');
  const [typeMessage, setTypeMessage] = useState('');

  const [header, setHeader] = useState<string | undefined>('');
  const [labelLink, setLabelLink] = useState<string | undefined>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputCode, setInputCode] = useState<string[]>(Array(6).fill(''));
  const [tokenEmail, setTokenEmail] = useState<any>(null);
  const [expirationTime, setExpirationTime] = useState<Date | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);
  const mutationSubmit = useVerificationcCodeMutation();
  const mutationResend = useResendVCodeMutation();
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const { data: result, error } = useTokenCheckQuery({ token });
  const checkToken = useCallback(async () => {
    if (!token) {
      return router.push('/recovery');
    }
    if (error) {
      console.error('Error fetching token:', error.message);
      router.push('/recovery');
      return;
    }
  }, [token, error, router]);
  useEffect(() => {
    checkToken();
  }, [checkToken]);

  useEffect(() => {
    if (result) {
      setHeader('Confirming your verification code');
      setLoading(false);
      if (
        result.existingToken &&
        result.existingToken.email &&
        result.existingToken.expiresCode &&
        result.existingToken.tokenType
      ) {
        setTokenEmail(result.existingToken.email);
        setExpirationTime(new Date(result.existingToken.expiresCode));
      }
    }
  }, [result]);
  /**
   * @todo set setHeader,setTokenEmail, setExpirationTime
   */

  //   const checkToken = useCallback(async () => {
  //     try {
  //     //   const data = await VerificationTokenSignUp(token, Ttype);
  //     //   const result = await data.json()
  //       console.log(result);
  //     //   if(data.errorRecovery){
  //     //     return router.push('/recovery')
  //     //   }
  //     //   if (data.error) {
  //     //     setMessage(data.error);
  //     //     setTypeMessage('error');
  //     //   } else {
  //     //     setHeader('Confirming your verification code');
  //     //     setLoading(false);
  //     //     if (data.existingToken && data.existingToken.email && data.existingToken.expiresCode) {
  //     //       setTokenEmail(data.existingToken.email);
  //     //       setExpirationTime(new Date(data.existingToken.expiresCode));
  //     //     }
  //     //   }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }, [token, loading]);

  //   useEffect(() => {
  //     checkToken();
  //   }, [checkToken, tokenEmail]);

  useEffect(() => {
    if (inputRefs.current.length !== inputCode.length) {
      inputRefs.current = Array(inputCode.length)
        .fill(null)
        .map((_, i) => inputRefs.current[i] || createRef<HTMLInputElement>());
    }

    if (expirationTime) {
      const initialSeconds = calculateRemainingTime(expirationTime);
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
  }, [inputCode.length, secondsRemaining, expirationTime]);

  const handleSubmit = async () => {
    try {
      const verificationCode = inputCode.join('');
      if (verificationCode.length !== 6) return makeToastError('Please complete the verification code.');
      setLoading(true);
      try {
        setIsPending(true);
        const data = {
          email: tokenEmail,
          verificationCode: verificationCode,
          Ttype: result?.existingToken.tokenType,
        };
        setLabelLink('');
        mutationSubmit.mutate(data, {
          onSuccess: (res) => {
            setMessage('Verification completed!');
            setTypeMessage('success');
            if (!res.token) {
              router.push('/sign-in');
              return;
            } else {
              router.push(`/recovery/reset-password?token=${res.token.token}`);
              return;
            }
          },
          onError: (error) => {
            makeToastError(error.message);
            return;
          },
          onSettled: () => {
            setIsPending(false);
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsPending(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onResendCode = async () => {
    try {
      setLabelLink('');
      const data = {
        email: tokenEmail,
      };
      mutationResend.mutate(data, {
        onSuccess: (res) => {
          setTimeout(() => {
            window.location.reload();
          }, 100);
        },
        onError: (error) => {
          setLabelLink('Resend Verification Code');
          makeToastError(error.message);
          return;
        },
        onSettled: () => {
          setIsPending(false);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CardWrapper
      headerLabel={header || 'Please double check your token or sign up again.'}
      backButtonHref=''
      backButtonLabel={header ? labelLink : ''}
      onResendCode={onResendCode}
    >
      {expirationTime && !message && (
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
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(index, e.target.value, inputCode, setInputCode, inputRefs)
                }
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
            <Button
              type='submit'
              disabled={isPending || labelLink == null}
              className='w-[50%] bg-blue-600 hover:bg-blue-700 text-white'
              onClick={handleSubmit}
            >
              Verify
            </Button>
          </div>
        </>
      ) : null}
    </CardWrapper>
  );
};

export default VerificationForm;
