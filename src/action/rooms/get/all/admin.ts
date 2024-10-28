"use server"
import dbConnect from "@/lib/db/db";
import { getAllRoom } from "@/services/room";

export const getAllRoomAction = async () => {
    try {
      await dbConnect();
      const rooms = await getAllRoom();
      return { rooms: JSON.parse(JSON.stringify(rooms)), status: 201 };
    } catch (error) {
      return { error: 'Something went wrong', status: 500 };
    }
  };