import { getToastContext } from './toaster';
import {
  ToastVariant,
  type ToastFunction,
  type ToastUpdateFunction,
} from './types';

export const toast: ToastFunction = (title, options) => {
  return getToastContext().addToast(title, options);
};

export const updateToast: ToastUpdateFunction = (id, options) => {
  return getToastContext().updateToast(id, options);
};

toast.success = (title, options = {}) => {
  return getToastContext().addToast(title, {
    ...options,
    variant: ToastVariant.SUCCESS,
  });
};

toast.error = (title: string, options = {}) => {
  return getToastContext().addToast(title, {
    ...options,
    variant: ToastVariant.ERROR,
  });
};

toast.info = (title: string, options = {}) => {
  return getToastContext().addToast(title, {
    ...options,
    variant: ToastVariant.INFO,
  });
};

toast.promise = (promise, options) => {
  return getToastContext().addToast(options.loading, {
    ...options,
    variant: ToastVariant.INFO,
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
