import { toast, Bounce} from "react-toastify";

export const alertToast = (message) => {
    toast(message, {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        hideProgressBar: true,
        theme: "light",
        transition: Bounce,
        style: {
            borderBottom: "5px solid green"
        }
    });
}

export const errorToast = (message) => {
    toast.error(message, {
        position: "top-center",
        autoClose: 500,
        type: "error",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        hideProgressBar: true,
        theme: "light",
        transition: Bounce,
        style: {
            borderBottom: "5px solid red"
        }
    });
}