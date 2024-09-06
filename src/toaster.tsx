import * as React from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';
import { v4 as uuidv4 } from 'uuid';
import { toastDefaultValues } from './constants';
import { ToastContext } from './context';
import { Toast } from './toast';
import {
  type ToastFunctionContext,
  type ToastFunctionOptions,
  type ToastProps,
  type ToastProviderProps,
} from './types';

let addToastHandler: ToastFunctionContext;

export const Toaster: React.FC<ToastProviderProps> = (props) => {
  if (Platform.OS === 'ios') {
    return (
      <FullWindowOverlay>
        <ToasterUI {...props} />
      </FullWindowOverlay>
    );
  }

  return <ToasterUI {...props} />;
};

export const ToasterUI: React.FC<ToastProviderProps> = ({
  duration = toastDefaultValues.duration,
  position = toastDefaultValues.position,
  maxToasts = toastDefaultValues.maxToasts,
  swipToDismissDirection = toastDefaultValues.swipeToDismissDirection,
  closeButton,
  rootStyle,
  rootClassName,
  toastContainerClassName,
  toastContainerStyle,
  toastContentClassName,
  toastContentStyle,
  ...props
}) => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);
  const { top, bottom } = useSafeAreaInsets();

  addToastHandler = React.useCallback(
    (title, options?: ToastFunctionOptions) => {
      const id = uuidv4();
      const newToast = {
        ...options,
        id: options?.id ?? id,
        title,
        variant: options?.variant ?? toastDefaultValues.variant,
      };

      if (options?.id) {
        // we're updating
        setToasts((currentToasts) =>
          currentToasts.map((toast) => {
            if (toast.id === options.id) {
              return {
                ...toast,
                ...newToast,
                id: options.id,
              };
            }
            return toast;
          })
        );

        return options.id;
      }

      setToasts((currentToasts) => {
        const newToasts: ToastProps[] = [...currentToasts, newToast];

        if (newToasts.length > maxToasts) {
          newToasts.shift();
        }
        return newToasts;
      });

      return id;
    },
    [maxToasts]
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  const value = React.useMemo(
    () => ({
      addToast: addToastHandler,
      duration: duration ?? toastDefaultValues.duration,
      position: position ?? toastDefaultValues.position,
      swipToDismissDirection:
        swipToDismissDirection ?? toastDefaultValues.swipeToDismissDirection,
      closeButton: closeButton ?? toastDefaultValues.closeButton,
    }),
    [closeButton, duration, position, swipToDismissDirection]
  );

  const positionedToasts = React.useMemo(() => {
    return position === 'bottom-center' ? toasts : toasts.slice().reverse();
  }, [position, toasts]);

  const insetValues = React.useMemo(() => {
    if (position === 'bottom-center') {
      if (bottom > 0) {
        return { bottom };
      }
      return { bottom: 40 };
    }

    if (position === 'top-center') {
      if (top > 0) {
        return { top };
      }
      return { top: 40 };
    }

    return {};
  }, [position, bottom, top]);

  const onDismiss = React.useCallback<
    NonNullable<React.ComponentProps<typeof Toast>['onDismiss']>
  >(
    (id) => {
      removeToast(id);
    },
    [removeToast]
  );

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
              onDismiss={onDismiss}
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
  if (!addToastHandler) {
    throw new Error('ToastContext is not initialized');
  }
  return { addToast: addToastHandler };
};
