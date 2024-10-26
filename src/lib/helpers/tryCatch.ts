"use server"

export const tryCatch = async (fn: Function, ...args: any[]): Promise<any> => {
    try {
      return await fn(...args); // Executes the passed function with arguments
    } catch (error) {
      console.error('Error', error);
      return { error: 'Internal Server Error', status: 500 };
    }
  };
  