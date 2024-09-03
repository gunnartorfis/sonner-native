import {
  ToastPosition,
  ToastSwipeDirection,
  ToastVariant,
} from '@/types/toastTypes';

export const toastDefaultValues = {
  duration: 3000,
  position: ToastPosition.TOP_CENTER,
  swipeToDismissDirection: ToastSwipeDirection.UP,
  variant: ToastVariant.INFO,
};
