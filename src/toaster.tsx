import * as React from 'react';
import { Platform } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import { toastDefaultValues } from './constants';
import { ToastContext } from './context';
import { Positioner } from './positioner';
import { Toast } from './toast';
import {
  toast,
  type AddToastContextHandler,
  type ToasterContextType,
  type ToasterProps,
  type ToastProps,
  type ToastRef,
} from './types';
import { areToastsEqual } from './toast-comparator';

let addToastHandler: AddToastContextHandler;
let dismissToastHandler: typeof toast.dismiss;
let wiggleHandler: typeof toast.wiggle;

export const Toaster: React.FC<ToasterProps> = ({
  ToasterOverlayWrapper,
  ...props
}) => {
  if (ToasterOverlayWrapper) {
    return (
      <ToasterOverlayWrapper>{<ToasterUI {...props} />}</ToasterOverlayWrapper>
    );
  }

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
  swipeToDismissDirection = toastDefaultValues.swipeToDismissDirection,
  closeButton,
  invert,
  toastOptions = {},
  icons,
  pauseWhenPageIsHidden,
  cn,
  gap,
  theme,
  autoWiggleOnUpdate,
  ...props
}) => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);
  const toastsCounter = React.useRef(1);
  const toastRefs = React.useRef<Record<string, React.RefObject<ToastRef>>>({});

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

      const existingToast = toasts.find(
        (currentToast) => currentToast.id === options?.id
      );

      if (existingToast && options?.id) {
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

        if (
          autoWiggleOnUpdate === 'always' ||
          (autoWiggleOnUpdate === 'toast-change' &&
            !areToastsEqual(newToast, existingToast))
        ) {
          wiggleHandler(options.id);
        }

        return options.id;
      }

      setToasts((currentToasts) => {
        const newToasts: ToastProps[] = [...currentToasts, newToast];

        if (!(newToast.id in toastRefs.current)) {
          toastRefs.current[newToast.id] = React.createRef<ToastRef>();
        }

        if (newToasts.length > visibleToasts) {
          newToasts.shift();
        }
        return newToasts;
      });

      return id;
    },
    [autoWiggleOnUpdate, duration, toasts, visibleToasts]
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

  dismissToastHandler = React.useCallback(
    (id) => {
      return dismissToast(id);
    },
    [dismissToast]
  );

  wiggleHandler = React.useCallback((id) => {
    const toastRef = toastRefs.current[id];
    if (toastRef && toastRef.current) {
      toastRef.current.wiggle();
    }
  }, []);

  const { style, className, unstyled } = toastOptions;

  const value = React.useMemo<ToasterContextType>(
    () => ({
      duration: duration ?? toastDefaultValues.duration,
      position: position ?? toastDefaultValues.position,
      offset: offset ?? toastDefaultValues.offset,
      swipeToDismissDirection:
        swipeToDismissDirection ?? toastDefaultValues.swipeToDismissDirection,
      closeButton: closeButton ?? toastDefaultValues.closeButton,
      unstyled: unstyled ?? toastDefaultValues.unstyled,
      addToast: addToastHandler,
      invert: invert ?? toastDefaultValues.invert,
      icons: icons ?? {},
      pauseWhenPageIsHidden:
        pauseWhenPageIsHidden ?? toastDefaultValues.pauseWhenPageIsHidden,
      cn: cn ?? toastDefaultValues.cn,
      gap: gap ?? toastDefaultValues.gap,
      theme: theme ?? toastDefaultValues.theme,
      toastOptions,
      autoWiggleOnUpdate:
        autoWiggleOnUpdate ?? toastDefaultValues.autoWiggleOnUpdate,
    }),
    [
      duration,
      position,
      offset,
      swipeToDismissDirection,
      closeButton,
      unstyled,
      invert,
      icons,
      pauseWhenPageIsHidden,
      cn,
      gap,
      theme,
      toastOptions,
      autoWiggleOnUpdate,
    ]
  );

  const orderToastsFromPosition = React.useCallback(
    (currentToasts: ToastProps[]) => {
      return position === 'bottom-center'
        ? currentToasts
        : currentToasts.slice().reverse();
    },
    [position]
  );

  const dynamicPositionedToasts = React.useMemo(() => {
    return toasts.filter(
      (currentToast) =>
        currentToast.position && currentToast.position !== position
    );
  }, [position, toasts]);

  const nonDynamicToasts = React.useMemo(() => {
    return toasts.filter(
      (currentToast) => !dynamicPositionedToasts.includes(currentToast)
    );
  }, [dynamicPositionedToasts, toasts]);

  const positionedNonDynamicToasts = React.useMemo(() => {
    return orderToastsFromPosition(nonDynamicToasts);
  }, [nonDynamicToasts, orderToastsFromPosition]);

  const positionedDynamicToasts = React.useMemo(() => {
    return orderToastsFromPosition(dynamicPositionedToasts);
  }, [dynamicPositionedToasts, orderToastsFromPosition]);

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
      <Positioner className={className} style={style} position={position}>
        {positionedNonDynamicToasts.map((positionedToast) => {
          return (
            <Toast
              key={positionedToast.id}
              {...positionedToast}
              onDismiss={onDismiss}
              onAutoClose={onAutoClose}
              ref={toastRefs.current[positionedToast.id]}
              {...props}
            />
          );
        })}
      </Positioner>
      <Positioner
        className={className}
        style={style}
        position={
          positionedDynamicToasts?.[0]?.position ?? toastDefaultValues.position
        }
      >
        {positionedDynamicToasts.map((positionedToast) => {
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
      </Positioner>
    </ToastContext.Provider>
  );
};

export const getToastContext = () => {
  if (!addToastHandler || !dismissToastHandler || !wiggleHandler) {
    throw new Error('ToastContext is not initialized');
  }
  return {
    addToast: addToastHandler,
    dismissToast: dismissToastHandler,
    wiggleToast: wiggleHandler,
  };
};
