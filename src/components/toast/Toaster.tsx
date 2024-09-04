import { ToastContext } from './ToastContext';
import {
  ToastPosition,
  type ToastFunctionBase,
  type ToastFunctionOptions,
  type ToastProps,
  type ToastProviderProps,
  type ToastUpdateFunction,
} from '../../types/toastTypes';
import { toastDefaultValues } from '../../utils/toastConstants';
import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';
import { v4 as uuidv4 } from 'uuid';
import Toast from './Toast';

let addToastHandler: ToastFunctionBase;
let updateToastHandler: ToastUpdateFunction;

const { TOP_CENTER, BOTTOM_CENTER } = ToastPosition;

export const Toaster: React.FC<ToastProviderProps> = ({
  duration,
  position,
  maxToasts = 3,
  rootStyle,
  rootClassName,
  toastContainerClassName,
  toastContainerStyle,
  toastContentClassName,
  toastContentStyle,
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
    <FullWindowOverlay>
      <ToastContext.Provider value={value}>
        <View
          style={[
            {
              position: 'absolute',
              width: '100%',
              alignItems: 'center',
              bottom:
                position === BOTTOM_CENTER && bottom > 0
                  ? 0
                  : position === BOTTOM_CENTER && bottom === 0
                    ? 40
                    : undefined,
              top:
                position === TOP_CENTER && top > 0
                  ? 0
                  : position === TOP_CENTER && top === 0
                    ? 40
                    : undefined,
            },
            rootStyle,
          ]}
          className={rootClassName}
        >
          {positionedToasts.map((toast) => {
            return (
              <Toast
                key={toast.id}
                {...toast}
                onHide={() => removeToast(toast.id)}
                className={toastContentClassName}
                style={toastContentStyle}
                containerStyle={toastContainerStyle}
                containerClassName={toastContainerClassName}
                {...props}
              />
            );
          })}
        </View>
      </ToastContext.Provider>
    </FullWindowOverlay>
  );
};

export const getToastContext = () => {
  if (!addToastHandler || !updateToastHandler) {
    throw new Error('ToastContext is not initialized');
  }
  return { addToast: addToastHandler, updateToast: updateToastHandler };
};
