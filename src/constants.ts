import type { ToastPosition, ToastSwipeDirection, ToastVariant } from './types';

export const toastDefaultValues: {
  duration: number;
  position: ToastPosition;
  swipeToDismissDirection: ToastSwipeDirection;
  variant: ToastVariant;
  visibleToasts: number;
  closeButton: boolean;
  dismissible: boolean;
} = {
  duration: 3000,
  position: 'top-center',
  swipeToDismissDirection: 'up',
  variant: 'info',
  visibleToasts: 3,
  closeButton: false,
  dismissible: true,
};
