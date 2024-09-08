import type { TextStyle, ViewStyle } from 'react-native';

type StyleProps = {
  unstyled?: boolean;
  style?: ViewStyle;
  className?: string;
  classNames?: {
    toastContainer?: string;
    toast?: string;
    toastContent?: string;
    title?: string;
    description?: string;
    buttons?: string;
    closeButton?: string;
    closeButtonIcon?: string;
  };
  styles?: {
    toastContainer?: ViewStyle;
    toast?: ViewStyle;
    toastContent?: ViewStyle;
    title?: TextStyle;
    description?: TextStyle;
    buttons?: ViewStyle;
    closeButton?: ViewStyle;
    closeButtonIcon?: ViewStyle;
  };
};

type PromiseOptions = {
  promise: Promise<unknown>;
  success: (result: any) => string; // TODO: type this with generics
  error: string;
  loading: string;
};

export type ToastPosition = 'top-center' | 'bottom-center';

export type ToastTheme = 'light' | 'dark' | 'system';

export type ToastSwipeDirection = 'left' | 'up';

export type ToastVariant = 'success' | 'error' | 'info' | 'loading';

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastProps = StyleProps & {
  id: string;
  title: string;
  variant: ToastVariant;
  jsx?: React.ReactNode;
  description?: string;
  closeButton?: boolean;
  invert?: boolean;
  // important?: boolean; (false) Control the sensitivity of the toast for screen readers
  duration?: number;
  position?: ToastPosition;
  dismissible?: boolean;
  icon?: React.ReactNode;
  action?: ToastAction | React.ReactNode;
  cancel?: ToastAction | React.ReactNode;
  onDismiss?: (id: string) => void;
  onAutoClose?: (id: string) => void;
  promiseOptions?: PromiseOptions;
  actionButtonStyle?: ViewStyle;
  actionButtonTextStyle?: TextStyle;
  actionButtonClassName?: string;
  actionButtonTextClassName?: string;
  cancelButtonStyle?: ViewStyle;
  cancelButtonTextStyle?: TextStyle;
  cancelButtonClassName?: string;
  cancelButtonTextClassName?: string;
};

export function isToastAction(
  action: ToastAction | React.ReactNode
): action is ToastAction {
  return (action as ToastAction)?.onClick !== undefined;
}

type ExternalToast = Omit<
  ToastProps,
  'id' | 'type' | 'title' | 'jsx' | 'promise' | 'variant'
> & {
  id?: string;
};

export type ToasterProps = StyleProps & {
  duration?: number;
  theme?: ToastTheme;
  // richColors?: boolean; (false)
  // expand?: boolean; // hover not supported on mobile
  visibleToasts?: number;
  position?: ToastPosition;
  closeButton?: boolean;
  offset?: number;
  // dir?: 'ltr' | 'rtl'; (ltr)
  // hotkey?: string; // hotkeys not supported on mobile
  invert?: boolean;
  toastOptions?: StyleProps;
  gap?: number;
  loadingIcon?: React.ReactNode;
  // pauseWhenPageIsHidden?: boolean; (false)
  icons?: {
    success?: React.ReactNode;
    error?: React.ReactNode;
    info?: React.ReactNode;
    loading?: React.ReactNode;
  };
  swipToDismissDirection?: ToastSwipeDirection;
  pauseWhenPageIsHidden?: boolean;
};

export type AddToastContextHandler = (
  data: Omit<ToastProps, 'id'> & { id?: string }
) => string;

export type ToasterContextType = Required<
  Pick<
    ToasterProps,
    | 'duration'
    | 'swipToDismissDirection'
    | 'closeButton'
    | 'position'
    | 'unstyled'
    | 'invert'
    | 'styles'
    | 'classNames'
    | 'icons'
    | 'offset'
    | 'pauseWhenPageIsHidden'
  >
> & {
  addToast: AddToastContextHandler;
};

export declare const toast: ((
  message: string,
  data?: ExternalToast
) => string) & {
  success: (message: string, data?: ExternalToast) => string;
  info: (message: string, data?: ExternalToast) => string;
  error: (message: string, data?: ExternalToast) => string;
  custom: (jsx: React.ReactElement, data?: ExternalToast) => string;
  promise: <T>(
    promise: Promise<T>,
    options: Omit<PromiseOptions, 'promise'>
  ) => string;
  loading: (message: string, data?: ExternalToast) => string;
  dismiss: (id?: string) => string | undefined;
};
