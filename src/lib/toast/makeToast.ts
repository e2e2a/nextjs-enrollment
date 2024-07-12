import toast from 'react-hot-toast';

export const makeToastSucess = (text: string) => {
    toast.success(text, {
        style: {
            borderRadius: "4px",
            background: "#333",
            color: "#fff",
        },
        // position: "top-right",
    })
}

export const makeToastError = (text: string) => {
    toast.error(text, {
        style: {
            borderRadius: "4px",
            background: "#333",
            color: "#fff",
        },
        // position: "top-right",
    })
}