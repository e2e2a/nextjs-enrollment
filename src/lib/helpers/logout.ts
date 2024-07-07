"use server"

import { auth, signOut } from "@/auth"
import db from "../db";

export const logout = async(userId: string) => {
    // Update the user's activation status and clear the active IP address
  await db.user.update({
    where: { id: userId },
    data: {
      activation: false
    }
  });

  // Call the actual signOut function
  await signOut();
}