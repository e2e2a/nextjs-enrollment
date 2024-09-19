'use client';
import React, { ReactNode } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Header from './auth/Header';
import SocialFooter from './auth/SocialFooter';
import BackButton from './auth/BackButton';

interface CardWrapperProps {
  children: ReactNode;
  header: string;
  headerLabel: string;
  backButtonLabel?: string;
  backButtonHref?: string;
  onResendCode?: () => void;
  BackButtonSideLabelHref?: string;
  showSocial?: boolean;
  className?: string | null;
}

const CardWrapper = ({
  children,
  header,
  headerLabel,
  backButtonHref,
  backButtonLabel,
  onResendCode,
  showSocial,
  className,
}: CardWrapperProps) => {
  return (
    <Card className={`sm:w-[500px] w-full shadow-md bg-white text-black ${className}`}>
      <CardHeader>
        <Header label={headerLabel} header={header}/>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <SocialFooter />
        </CardFooter>
      )}
      {backButtonLabel ? (
        <CardFooter>
          <BackButton label={backButtonLabel} href={backButtonHref} onResendCode={onResendCode} />
        </CardFooter>
      ) : null}
    </Card>
  );
};

export default CardWrapper;
