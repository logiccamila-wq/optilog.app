import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

const useToast = () => {
    const { addToast } = useContext(ToastContext);

    const toast = (message, options) => {
        addToast(message, options);
    };

    return { toast };
};

export default useToast;