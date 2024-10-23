"use server"

export const tryCatch = async (fn: Function, ...args: any[]): Promise<any> => {
    try {
      return await fn(...args); // Executes the passed function with arguments
    } catch (error) {
      console.error('Error in server action:', error);
      return { error: 'Internal Server Error', status: 500 };
    }
  };
  