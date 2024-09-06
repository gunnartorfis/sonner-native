import { getToastContext } from './toaster';
import { type ToastFunction } from './types';

export const toast: ToastFunction = (title, options) => {
  return getToastContext().addToast(title, options);
};

toast.success = (title, options = {}) => {
  return getToastContext().addToast(title, {
    ...options,
    variant: 'success',
  });
};

toast.error = (title: string, options = {}) => {
  return getToastContext().addToast(title, {
    ...options,
    variant: 'error',
  });
};

toast.info = (title: string, options = {}) => {
  return getToastContext().addToast(title, {
    ...options,
    variant: 'info',
  });
};

toast.promise = (promise, options) => {
  return getToastContext().addToast(options.loading, {
    ...options,
    variant: 'info',
    promiseOptions: {
      promise,
      ...options,
    },
  });
};

toast.custom = (element, options) => {
  return getToastContext().addToast('', {
    element,
    ...options,
  });
};

toast.dismiss = (id) => {
  return getToastContext().dismissToast(id);
};
