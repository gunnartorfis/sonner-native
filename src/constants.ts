import { ToastPosition, ToastSwipeDirection, ToastVariant } from './types';

export const toastDefaultValues = {
  duration: 3000,
  position: ToastPosition.TOP_CENTER,
  swipeToDismissDirection: ToastSwipeDirection.UP,
  variant: ToastVariant.INFO,
};
