'use server';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from '@/firebase';
import { getCourseResponse, testResponseaa } from '@/types';
import { Readable } from 'stream';
import { createCourse, getCourseByName, getCourseByCourseCode, getCourses, updateCoursePhotoById, getCoursesByCategory } from '@/services/course';
import dbConnect from '@/lib/db/db';
import { createCurriculum } from '@/services/curriculum';
export const createCourseAction = async (data: any): Promise<testResponseaa> => {
  await dbConnect();
  const file = data.formData.get('file') as File;
  console.log('data ', data);
  try {
    const checkCourseCode = await getCourseByCourseCode(data.courseCode);
    if (checkCourseCode) return { error: 'Course code already exist, please choose another code.', status: 409 };

    const checkName = await getCourseByName(data.name);
    if (checkName) return { error: 'Course name already exist, please choose another name.', status: 409 };

    // const ccData = {
    //   // imageUrl: `${imageUrl}`,
    // };
    const cc = await createCourse(data);
    if (!cc) return { message: 'Something went wrong.', status: 500 };
    const storageRef = ref(storage, `courses/${cc._id}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    let imageUrl = '';
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // setProgressUpload(progress);
      },
      (error) => {
        // makeToastError(error.message);
        return console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          console.log(url);
          const updatedC = await updateCoursePhotoById(cc._id, url);
          console.log('updatedC', updatedC);
        });
      }
    );
    const cp = await createCurriculum({ courseId: cc._id });
    if (!cp) return { error: 'Something went wrong.', status: 404 };
    console.log(cp);
  } catch (error) {
    console.log(error);
  }
  return { message: 'New Course has been added.', status: 201 };
};

export const getAllCourses = async (): Promise<getCourseResponse> => {
  await dbConnect();
  try {
    const courses = await getCourses();
    return { courses: courses, status: 200 };
  } catch (error) {
    console.log(error);
    return { error: 'Something went wrong.', status: 500 };
  }
};

// export const getAllCoursesByCategory = async (category: any): Promise<getCourseResponse> => {
//   await dbConnect();
//   try {
//     const courses = await getCoursesByCategory(category);
//     return { courses: JSON.parse(JSON.stringify(courses)), status: 200 };
//   } catch (error) {
//     console.log(error);
//     return { error: 'Something went wrong.', status: 500 };
//   }
// };
