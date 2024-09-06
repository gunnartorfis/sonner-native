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
    [visibleToasts]
  );

  dismissToastHandler = React.useCallback<typeof toast.dismiss>((id) => {
    if (!id) {
      setToasts([]);
      return;
    }

    setToasts((currentToasts) =>
      currentToasts.filter((currentToast) => currentToast.id !== id)
    );
    return id;
  }, []);

  const value = React.useMemo<ToasterContextType>(
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
  >((id) => {
    dismissToastHandler(id);
  }, []);

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
              onAutoClose={onDismiss}
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
