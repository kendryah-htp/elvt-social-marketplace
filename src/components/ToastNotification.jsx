import { toast } from 'sonner';

export const showSuccess = (message, options = {}) => {
  toast.success(message, {
    duration: 3000,
    ...options
  });
};

export const showError = (message, options = {}) => {
  toast.error(message, {
    duration: 4000,
    ...options
  });
};

export const showInfo = (message, options = {}) => {
  toast.info(message, {
    duration: 3000,
    ...options
  });
};

export const showWarning = (message, options = {}) => {
  toast.warning(message, {
    duration: 3500,
    ...options
  });
};

export const showLoading = (message) => {
  return toast.loading(message);
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};