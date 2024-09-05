import type { ToastPosition, ToastSwipeDirection, ToastVariant } from './types';

export const toastDefaultValues: {
  duration: number;
  position: ToastPosition;
  swipeToDismissDirection: ToastSwipeDirection;
  variant: ToastVariant;
} = {
  duration: 3000,
  position: 'top-center',
  swipeToDismissDirection: 'up',
  variant: 'info',
};
