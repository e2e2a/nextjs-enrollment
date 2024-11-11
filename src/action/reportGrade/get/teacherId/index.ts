// 'use server';
// import dbConnect from '@/lib/db/db';
// import { tryCatch } from '@/lib/helpers/tryCatch';
// import { RoomValidator } from '@/lib/validators/room/create';
// import { createRoom, getRoomByName } from '@/services/room';
// import { verifyADMIN } from '@/utils/actions/session/roles/admin';

// export const createRoomAction = async (data: any) => {
//   return tryCatch(async () => {
//     await dbConnect();
//     const session = await verifyADMIN();
//     if (!session || session.error) return { error: 'Not Authorized.', status: 403 };

//     const roomParse = RoomValidator.safeParse(data);
//     if (!roomParse.success) return { error: 'Invalid fields!', status: 400 };

//     const checkRoomConflict = await getRoomByName(data.roomName);
//     if (checkRoomConflict) return { error: 'Room name already exists.', status: 403 };

//     const createdRoom = await createRoom(data);
//     if (!createdRoom) return { error: 'Something went wrong.', status: 500 };
//     return { message: 'Subject created successfully.', level: data.educationLevel, status: 201 };
//   });
// };