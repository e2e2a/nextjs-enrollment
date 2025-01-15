'use client';
import React from 'react';
import { NotificationDropdown } from './NotificationDropdown';

interface IProps {
  session: any;
}

export const Notification = ({ session }: IProps) => {
  return (
    <div>
      <NotificationDropdown session={session} />
    </div>
  );
};
