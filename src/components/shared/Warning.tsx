'use client';
import React, { useEffect, useState } from 'react';
let hasLoggedWarning = false;
const Warning = () => {
  useEffect(() => {
    if (!hasLoggedWarning) {
      console.log('%cSTOP! %cDo not share your data or credentials in this console.', 'color: red; font-size: 40px; font-weight: bold; text-shadow: 2px 2px black;', 'color: black; font-size: 16px;');

      console.log('%cThis browser feature is intended for developers. If someone asks you to copy-paste something here, it could be a security risk.', 'color: orange; font-size: 16px;');

      console.log("%cIf you're not sure what you're doing, please close this tab and do not interact with the console.", 'color: #ff3300; font-size: 16px; font-weight: bold;');
      hasLoggedWarning = true;
    }
  }, []); 

  return null;
};

export default Warning;
