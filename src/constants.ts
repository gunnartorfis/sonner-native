import type { ToastPosition, ToastSwipeDirection, ToastVariant } from './types';

export const toastDefaultValues: {
  duration: number;
  position: ToastPosition;
  offset: number;
  swipeToDismissDirection: ToastSwipeDirection;
  variant: ToastVariant;
  visibleToasts: number;
  closeButton: boolean;
  dismissible: boolean;
  unstyled: boolean;
  invert: boolean;
} = {
  duration: 4000,
  position: 'top-center',
  offset: 0,
  swipeToDismissDirection: 'up',
  variant: 'info',
  visibleToasts: 3,
  closeButton: false,
  dismissible: true,
  unstyled: false,
  invert: false,
};
