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
      y: ['-100vh', '0vh'], // Start off-screen (top) and move to center
      rotateY: [0, 360], // Rotate continuously after reaching the center
      transition: {
        duration: 1, // 1 sec to move to the center, then rotation continues
        times: [0, 1], // The movement happens only once
        ease: 'easeInOut', // Smooth transition
        rotateY: {
          delay: 1, // Delay the rotation to start after the movement
          duration: 5, // How long each full rotation takes
          repeat: Infinity, // Rotate continuously once in the center
          ease: 'linear', // Keep the rotation constant and smooth
        },
      },
    },
  };

  return (
    <div className='fixed inset-0 flex justify-center items-center bg-white z-50 select-none'>
      <div className='flex flex-col items-center'>
        <motion.div variants={flyVariants} animate='animate'>
          <Image src='/images/logo1.png' alt='loader' width={150} height={150} priority />
        </motion.div>
        <style jsx>{`
          .pulse-gradient {
            background-size: 200% 200%;
            animation: pulseGradient 3s ease infinite;
          }

          @keyframes pulseGradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>
        <p className='mt-4 text-transparent font-bold sm:font-semibold uppercase text-lg sm:text-xl md:text-2xl bg-gradient-to-r bg-clip-text pulse-gradient from-purple-400 via-pink-500 to-red-500'>Signing out</p>
      </div>
    </div>
  );
};
