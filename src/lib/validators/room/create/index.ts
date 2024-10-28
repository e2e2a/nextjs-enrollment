import { z } from 'zod';

export const RoomValidator = z.object({
  educationLevel: z.string().min(1, { message: 'Level is required...' }),
  roomName: z.string().min(1, { message: 'Room Name is required...' }),
  roomType: z.string().min(1, { message: 'Room Type is required...' }),
  floorLocation: z.string().optional(),
});
