import * as React from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';
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
  offset = toastDefaultValues.offset,
  visibleToasts = toastDefaultValues.visibleToasts,
  swipToDismissDirection = toastDefaultValues.swipeToDismissDirection,
  closeButton,
  style,
  className,
  unstyled,
  invert,
  toastOptions,
  icons,
  pauseWhenPageIsHidden,
  cn,
  ...props
}) => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);
  const toastsCounter = React.useRef(1);
  const { top, bottom } = useSafeAreaInsets();

  addToastHandler = React.useCallback(
    (options) => {
      const id =
        typeof options?.id === 'number' ||
        (options.id && options.id?.length > 0)
          ? options.id
          : toastsCounter.current++;

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
      id: string | number | undefined,
      origin?: 'onDismiss' | 'onAutoClose'
    ) => string | number | undefined
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
        toastsCounter.current = 1;
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
      offset: offset ?? toastDefaultValues.offset,
      swipToDismissDirection:
        swipToDismissDirection ?? toastDefaultValues.swipeToDismissDirection,
      closeButton: closeButton ?? toastDefaultValues.closeButton,
      unstyled: unstyled ?? toastDefaultValues.unstyled,
      addToast: addToastHandler,
      invert: invert ?? toastDefaultValues.invert,
      styles: toastOptions?.styles ?? {},
      classNames: toastOptions?.classNames ?? {},
      icons: icons ?? {},
      pauseWhenPageIsHidden:
        pauseWhenPageIsHidden ?? toastDefaultValues.pauseWhenPageIsHidden,
      cn: cn ?? toastDefaultValues.cn,
    }),
    [
      duration,
      position,
      offset,
      swipToDismissDirection,
      closeButton,
      unstyled,
      invert,
      toastOptions,
      icons,
      pauseWhenPageIsHidden,
      cn,
    ]
  );

  const positionedToasts = React.useMemo(() => {
    return position === 'bottom-center' ? toasts : toasts.slice().reverse();
  }, [position, toasts]);

  const insetValues = React.useMemo(() => {
    if (position === 'bottom-center') {
      if (offset) {
        return { bottom: offset };
      }

      if (bottom > 0) {
        return { bottom };
      }
      return { bottom: 40 };
    }

    if (position === 'top-center') {
      if (offset) {
        return { top: offset };
      }
      if (top > 0) {
        return { top };
      }
      return { top: 40 };
    }

    return {};
  }, [position, bottom, top, offset]);

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
