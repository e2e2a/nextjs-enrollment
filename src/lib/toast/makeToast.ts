import toast from 'react-hot-toast';
import CourseToast from './CourseToast';

export const makeToastSucess = (text: string) => {
    toast.success(text, {
        style: {
            borderRadius: "4px",
            background: "#fff",
            color: "#333",
        },
        // position: "top-right",
    })
}

export const makeToastError = (text: string) => {
    toast.error(text, {
        style: {
            borderRadius: "4px",
            background: "#fff",
            color: "#333",
        },
        // position: "top-right",
    })
}