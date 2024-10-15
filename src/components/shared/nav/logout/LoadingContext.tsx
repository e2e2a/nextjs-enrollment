'use client';
import React, { createContext, useContext, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const LoadingContext = createContext({
  loading: false,
  setLoading: (value: boolean) => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {loading && <LoadingOverlay />}
      {children}
    </LoadingContext.Provider>
  );
};

const LoadingOverlay = () => {
  const flyVariants = {
    animate: {
      x: ['100vw', '0vw', '0vw', '-100vw'], // Start off-screen (right), move to center, stay, then off-screen (left)
      rotateY: [0, 0, 180, 0], // Rotate around Y-axis while paused in the center
      transition: {
        duration: 5, // Total time for the entire cycle (1 sec to center + 3 sec pause + 1 sec to exit)
        times: [0, 0.2, 0.8, 1], // Control the timing of keyframes
        ease: 'easeInOut', // Smooth transition
        repeat: Infinity, // Repeat animation indefinitely
      },
    },
  };
  return (
    <div className='fixed inset-0 flex justify-center top-0 items-center bg-white z-50 select-none'>
      <div className='flex flex-col items-center'>
        <motion.div variants={flyVariants} animate='animate'>
          <Image src='/images/logo1.png' alt='loader' width={150} height={150} priority />
        </motion.div>
        <p className='mt-4 text-gray-700'>Signing out...</p>
      </div>
    </div>
  );
};
