"use server";
import { cookies, headers } from "next/headers";

export const mytest = async () => {
    try {
      //use auth()
      //the end
        const cookiesObj = cookies();
        const sessionCookie = cookiesObj.get('__session');
    
        if (!sessionCookie) {
          console.log('Session cookie not found');
          return;
        }
    
      } catch (error) {
        console.error('Error :', error);
        // Handle error appropriately, possibly return a response or throw further
      }
}
