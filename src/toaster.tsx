import * as React from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';
import { v4 as uuidv4 } from 'uuid';
import { toastDefaultValues } from './constants';
import { ToastContext } from './context';
import { Toast } from './toast';
import {
  toast,
  type AddToastContextHandler,
  type ToasterContextType,
  type ToasterProps,
  type ToastProps,
} from './types';

let addToastHandler: AddToastContextHandler;
let dismissToastHandler: typeof toast.dismiss;

export const Toaster: React.FC<ToasterProps> = (props) => {
  if (Platform.OS === 'ios') {
    return (
      <FullWindowOverlay>
        <ToasterUI {...props} />
      </FullWindowOverlay>
    );
  }

  return <ToasterUI {...props} />;
};

export const ToasterUI: React.FC<ToasterProps> = ({
  duration = toastDefaultValues.duration,
  position = toastDefaultValues.position,
  visibleToasts = toastDefaultValues.visibleToasts,
  swipToDismissDirection = toastDefaultValues.swipeToDismissDirection,
  closeButton,
  style,
  className,
  unstyled,
  invert,
  toastOptions,
  icons,
  ...props
}) => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);
  const { top, bottom } = useSafeAreaInsets();

  addToastHandler = React.useCallback(
    (options) => {
      const id = uuidv4();
      const newToast: ToastProps = {
        ...options,
        id: options?.id ?? id,
        variant: options.variant ?? toastDefaultValues.variant,
      };

      if (options?.id) {
        // we're updating
        setToasts((currentToasts) =>
          currentToasts.map((currentToast) => {
            if (currentToast.id === options.id) {
              return {
                ...currentToast,
                ...newToast,
                duration: options.duration ?? duration,
                id: options.id,
              };
            }
            return currentToast;
          })
        );

        return options.id;
      }

      setToasts((currentToasts) => {
        const newToasts: ToastProps[] = [...currentToasts, newToast];

        if (newToasts.length > visibleToasts) {
          newToasts.shift();
        }
        return newToasts;
      });

      return id;
    },
    [visibleToasts, duration]
  );

  const dismissToast = React.useCallback<
    (
      id: string | undefined,
      origin?: 'onDismiss' | 'onAutoClose'
    ) => string | undefined
  >(
    (id, origin) => {
      if (!id) {
        toasts.forEach((currentToast) => {
          if (origin === 'onDismiss') {
            currentToast.onDismiss?.(currentToast.id);
          } else {
            currentToast.onAutoClose?.(currentToast.id);
          }
        });
        setToasts([]);
        return;
      }

      setToasts((currentToasts) =>
        currentToasts.filter((currentToast) => currentToast.id !== id)
      );

      const toastForCallback = toasts.find(
        (currentToast) => currentToast.id === id
      );
      if (origin === 'onDismiss') {
        toastForCallback?.onDismiss?.(id);
      } else {
        toastForCallback?.onAutoClose?.(id);
      }

      return id;
    },
    [toasts]
  );

  dismissToastHandler = React.useCallback<typeof toast.dismiss>(
    (id) => {
      return dismissToast(id);
    },
    [dismissToast]
  );

  const value = React.useMemo<ToasterContextType>(
    () => ({
      duration: duration ?? toastDefaultValues.duration,
      position: position ?? toastDefaultValues.position,
      swipToDismissDirection:
        swipToDismissDirection ?? toastDefaultValues.swipeToDismissDirection,
      closeButton: closeButton ?? toastDefaultValues.closeButton,
      unstyled: unstyled ?? toastDefaultValues.unstyled,
      addToast: addToastHandler,
      invert: invert ?? toastDefaultValues.invert,
      styles: toastOptions?.styles ?? {},
      classNames: toastOptions?.classNames ?? {},
      icons: icons ?? {},
    }),
    [
      duration,
      position,
      swipToDismissDirection,
      closeButton,
      unstyled,
      invert,
      toastOptions,
      icons,
    ]
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
      dismissToast(id, 'onDismiss');
    },
    [dismissToast]
  );

  const onAutoClose = React.useCallback<
    NonNullable<React.ComponentProps<typeof Toast>['onDismiss']>
  >(
    (id) => {
      dismissToast(id, 'onAutoClose');
    },
    [dismissToast]
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
          style,
        ]}
        className={className}
      >
        {positionedToasts.map((positionedToast) => {
          return (
            <Toast
              key={positionedToast.id}
              {...positionedToast}
              onDismiss={onDismiss}
              onAutoClose={onAutoClose}
              {...props}
            />
          );
        })}
      </View>
    </ToastContext.Provider>
  );
};

export const getToastContext = () => {
  if (!addToastHandler || !dismissToastHandler) {
    throw new Error('ToastContext is not initialized');
  }
  return { addToast: addToastHandler, dismissToast: dismissToastHandler };
};
