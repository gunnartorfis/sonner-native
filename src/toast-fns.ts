import { getToastContext } from './toaster';
import { type toast as toastType } from './types';

export const toast: typeof toastType = (title, options) => {
  return getToastContext().addToast({
    title,
    variant: 'info',
    ...options,
  });
};

toast.success = (title, options = {}) => {
  return getToastContext().addToast({
    ...options,
    title,
    variant: 'success',
  });
};

toast.wiggle = (id) => {
  return getToastContext().wiggleToast(id);
};

toast.error = (title: string, options = {}) => {
  return getToastContext().addToast({
    ...options,
    title,
    variant: 'error',
  });
};

toast.warning = (title: string, options = {}) => {
  return getToastContext().addToast({
    ...options,
    title,
    variant: 'warning',
  });
};

toast.info = (title: string, options = {}) => {
  return getToastContext().addToast({
    title,
    ...options,
    variant: 'info',
  });
};

toast.promise = (promise, options) => {
  return getToastContext().addToast({
    ...options,
    title: options.loading,
    variant: 'info',
    promiseOptions: {
      ...options,
      promise,
    },
  });
};

toast.custom = (jsx, options) => {
  return getToastContext().addToast({
    title: '',
    variant: 'info',
    jsx,
    ...options,
  });
};

toast.loading = (title, options = {}) => {
  return getToastContext().addToast({
    title,
    variant: 'loading',
    ...options,
  });
};

toast.dismiss = (id) => {
  return getToastContext().dismissToast(id);
};
