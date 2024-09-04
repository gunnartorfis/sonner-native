import { ToastContext } from '@/components/toast/ToastContext';
import {
  ToastPosition,
  type ToastFunctionBase,
  type ToastFunctionOptions,
  type ToastProps,
  type ToastProviderProps,
  type ToastUpdateFunction,
} from '@/types/toastTypes';
import { cn } from '@/utils/tailwind-utils';
import { toastDefaultValues } from '@/utils/toastConstants';
import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';
import Toast from './Toast';

let addToastHandler: ToastFunctionBase;
let updateToastHandler: ToastUpdateFunction;

const { TOP_CENTER, BOTTOM_CENTER } = ToastPosition;

export const ToastProvider: React.FC<ToastProviderProps> = ({
  duration,
  position,
  maxToasts = 3,
  rootClassName,
  toastContainerClassName,
  toastContentClassName,
  swipToDismissDirection,
  ...props
}) => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);
  const { top, bottom } = useSafeAreaInsets();

  addToastHandler = (title, options?: ToastFunctionOptions) => {
    const id = uuidv4();
    setToasts((currentToasts) => {
      const newToasts = [
        ...currentToasts,
        {
          id,
          title,
          description: options?.description,
          variant: options?.variant ?? toastDefaultValues.variant,
          action: options?.action,
          promiseOptions: options?.promiseOptions,
        },
      ];

      if (newToasts.length > maxToasts) {
        newToasts.shift();
      }
      return newToasts;
    });

    return id;
  };

  const removeToast = (id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  };

  updateToastHandler = (id, newToast) => {
    setToasts((currentToasts) =>
      currentToasts.map((toast) => {
        if (toast.id === id) {
          return {
            ...toast,
            ...newToast,
          };
        }
        return toast;
      })
    );
  };

  const value = React.useMemo(
    () => ({
      addToast: addToastHandler,
      updateToast: updateToastHandler,
      duration: duration ?? toastDefaultValues.duration,
      position: position ?? toastDefaultValues.position,
      swipToDismissDirection:
        swipToDismissDirection ?? toastDefaultValues.swipeToDismissDirection,
    }),
    [duration, position, swipToDismissDirection]
  );

  const positionedToasts =
    position === ToastPosition.BOTTOM_CENTER
      ? toasts
      : toasts.slice().reverse();

  return (
    <ToastContext.Provider value={value}>
      <View
        className={cn(
          'absolute w-full items-center',
          {
            'bottom-10': position === BOTTOM_CENTER && bottom === 0,
            'top-10': position === TOP_CENTER && top === 0,
            'top-0': position === TOP_CENTER && top > 0,
            'bottom-0': position === BOTTOM_CENTER && bottom > 0,
          },
          rootClassName
        )}
      >
        {positionedToasts.map((toast) => {
          return (
            <Toast
              key={toast.id}
              {...toast}
              onHide={() => removeToast(toast.id)}
              className={toastContentClassName}
              containerClassName={toastContainerClassName}
              {...props}
            />
          );
        })}
      </View>
    </ToastContext.Provider>
  );
};

export const getToastContext = () => {
  if (!addToastHandler || !updateToastHandler) {
    throw new Error('ToastContext is not initialized');
  }
  return { addToast: addToastHandler, updateToast: updateToastHandler };
};
