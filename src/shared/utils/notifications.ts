import {Bounce, toast} from 'react-toastify';

export const showErrorNotification = (message = 'Error') => {
  toast.error(message, {
    position: 'top-right',
    autoClose: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
    transition: Bounce,
  });
};
