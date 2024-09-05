import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';
import { v4 as uuidv4 } from 'uuid';
import { toastDefaultValues } from './constants';
import { ToastContext } from './context';
import { Toast } from './toast';
import {
  ToastPosition,
  type ToastFunctionBase,
  type ToastFunctionOptions,
  type ToastProps,
  type ToastProviderProps,
  type ToastUpdateFunction,
} from './types';

let addToastHandler: ToastFunctionBase;
let updateToastHandler: ToastUpdateFunction;

const { TOP_CENTER, BOTTOM_CENTER } = ToastPosition;

export const Toaster: React.FC<ToastProviderProps> = (props) => {
  return (
    <FullWindowOverlay>
      <ToasterUI {...props} />
    </FullWindowOverlay>
  );
};

export const ToasterUI: React.FC<ToastProviderProps> = ({
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
  console.log(top, bottom, position);

  addToastHandler = (title, options?: ToastFunctionOptions) => {
    const id = uuidv4();
    setToasts((currentToasts) => {
      const newToasts = [
        ...currentToasts,
        {
          ...options,
          id,
          title,
          variant: options?.variant ?? toastDefaultValues.variant,
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
            id,
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

  const positionedToasts = React.useMemo(() => {
    return position === ToastPosition.BOTTOM_CENTER
      ? toasts
      : toasts.slice().reverse();
  }, [position, toasts]);

  const insetValues = React.useMemo(() => {
    if (position === BOTTOM_CENTER) {
      if (bottom > 0) {
        return { bottom };
      }
      return { bottom: 40 };
    }

    if (position === TOP_CENTER) {
      if (top > 0) {
        return { top };
      }
      return { top: 40 };
    }

    console.warn('Invalid position value');
    return {};
  }, [position, bottom, top]);

  return (
    <ToastContext.Provider value={value}>
      <View
        style={[
          {
            position: 'absolute',
            width: '100%',
            alignItems: 'center',
          },
          insetValues,
          rootStyle,
        ]}
        className={rootClassName}
      >
        {positionedToasts.map((toast) => {
          return (
            <Toast
              key={toast.id}
              {...toast}
              onHide={() => {
                removeToast(toast.id);
                toast.onHide?.();
              }}
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
  );
};

export const getToastContext = () => {
  if (!addToastHandler || !updateToastHandler) {
    throw new Error('ToastContext is not initialized');
  }
  return { addToast: addToastHandler, updateToast: updateToastHandler };
};
