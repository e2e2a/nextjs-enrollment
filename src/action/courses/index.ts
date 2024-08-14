'use server';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from '@/firebase';
import { testResponseaa } from '@/types';
import { Readable } from 'stream';
import { createCourse, getCourseByName, getCourseByTitle, updateCoursePhotoById } from '@/services/course';
export const createCourseAction = async (data: any): Promise<testResponseaa> => {
  /**
   * create a course model
   * use the model course _id in folder path
   * use filename to create the image
   */
  const file = data.formData.get('file') as File;
  console.log('filename ', file.name);
  try {
    const checkTitle = await getCourseByTitle(data.title);
    if (checkTitle) return { message: 'Course title already exist, please choose another title.', status: 409 };

    const checkName = await getCourseByName(data.name);
    if (checkName) return { message: 'Course name already exist, please choose another name.', status: 409 };

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
  } catch (error) {
    console.log(error);
  }
  return { message: 'hello world success', status: 201 };
};
