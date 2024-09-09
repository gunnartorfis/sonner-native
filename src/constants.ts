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
  pauseWhenPageIsHidden: boolean;
  cn: (...classes: Array<string | undefined>) => string;
  gap: number;
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
  pauseWhenPageIsHidden: false,
  cn: (...classes) => classes.filter(Boolean).join(' '),
  gap: 14,
};
