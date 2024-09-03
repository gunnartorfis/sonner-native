import { getToastContext } from '@/components/toast/ToastContext';
import { ToastVariant, type ToastFunction } from '@/types/toastTypes';

const toast: ToastFunction = (title, options) => {
  const { addToast } = getToastContext();
  return addToast(title, options);
};

toast.success = (title, options = {}) => {
  const { addToast } = getToastContext();
  return addToast(title, {
    ...options,
    variant: ToastVariant.SUCCESS,
  });
};

toast.error = (title: string, options = {}) => {
  const { addToast } = getToastContext();
  return addToast(title, {
    ...options,
    variant: ToastVariant.ERROR,
  });
};

toast.info = (title: string, options = {}) => {
  const { addToast } = getToastContext();
  return addToast(title, {
    ...options,
    variant: ToastVariant.INFO,
  });
};

toast.promise = (promise, options) => {
  const { addToast } = getToastContext();
  const { error, loading, success } = options;

  const toastId = addToast(loading, {
    ...options,
    variant: ToastVariant.INFO,
    promiseOptions: {
      promise,
      error,
      success,
      loading,
    },
  });

  return toastId;
};

export default toast;
