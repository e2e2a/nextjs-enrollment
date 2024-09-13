'use server';
import TeacherSchedule from '@/models/TeacherSchedule';

export const createTeacherSchedule = async (data: any) => {
  try {
    const newProfile = await TeacherSchedule.create({
      ...data,
    });
    return newProfile;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getTeacherScheduleByProfileId = async (profileId: any) => {
  try {
    const TProfile = await TeacherSchedule.findOne({ profileId })
    .populate('profileId')
    .populate('schedule.blockTypeId')
    .populate('schedule.subjectId')
    .populate('schedule.roomId')
    .exec();
    return TProfile;
  } catch (error) {
    return null;
  }
};

export const getTeacherScheduleByScheduleRoomId = async (roomId: any) => {
  try {
    const TProfile = await TeacherSchedule.find({ 'schedule.roomId': roomId });
    return TProfile;
  } catch (error) {
    return [];
  }
};
// ive added roomId

// const schema = new Schema<ITeacherSchedule>(
//   {
//     category: { type: String },
//     profileId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'TeacherProfile',
//     },
//     schedule: [
//       {
//         // this sectionId will be used to compare which section and subject to compare with students
//         // this will only added when its being selected in the list of schedules to add in the section
//         sectionId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'Section',
//         },
//         subjectId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'Subject',
//         },
//         roomId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'Room',
//         },
//         days: {
//           type: [String],
//           default: [],
//         },
//         startTime: {
//           type: String,
//         },
//         endTime: {
//           type: String,
//         },
//       },
//     ],
//   },

// we still need to check if the room is has a conflict. but the
