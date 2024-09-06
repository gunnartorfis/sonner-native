import type { TextStyle, ViewStyle } from 'react-native';

type StyleProps = {
  unstyled?: boolean;
  style?: ViewStyle;
  className?: string;
  classNames?: {
    toast?: string;
    title?: string;
    description?: string;
    actionButton?: string;
    actionButtonText?: string;
    closeButton?: string;
  };
  styles?: {
    toast?: ViewStyle;
    title?: TextStyle;
    description?: TextStyle;
    actionButton?: ViewStyle;
    actionButtonText?: TextStyle;
    closeButton?: ViewStyle;
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

export type ToastVariant = 'success' | 'error' | 'info';

export type ToastAction = {
  label: string;
  onPress: () => void;
};

type ToastOptions = StyleProps & {
  closeButton?: boolean;
  cancelButtonStyle?: React.CSSProperties;
  actionButtonStyle?: React.CSSProperties;
  duration?: number;
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
  action?: ToastAction;
  cancel?: ToastAction;
  onDismiss?: (id: string) => void;
  onAutoClose?: (id: string) => void;
  unstyled?: boolean;
  promiseOptions?: PromiseOptions;
  style?: ViewStyle;
  className?: string;
  actionButtonStyles?: ViewStyle;
  actionButtonTextStyles?: TextStyle;
  closeButtonStyles?: ViewStyle;
  closeButtonTextStyles?: TextStyle;
};

type ExternalToast = Omit<
  ToastProps,
  'id' | 'type' | 'title' | 'jsx' | 'promise' | 'variant'
> & {
  id?: string;
};

export type ToasterProps = {
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
  toastOptions?: ToastOptions;
  gap?: number;
  loadingIcon?: React.ReactNode;
  // pauseWhenPageIsHidden?: boolean; (false)
  icons?: {
    success?: React.ReactNode;
    error?: React.ReactNode;
    info?: React.ReactNode;
    loading?: React.ReactNode;
  };
  style?: ViewStyle;
  className?: string;

  swipToDismissDirection?: ToastSwipeDirection;
};

export type AddToastContextHandler = (
  data: Omit<ToastProps, 'id'> & { id?: string }
) => string;

export type ToasterContextType = Required<
  Pick<
    ToasterProps,
    'duration' | 'swipToDismissDirection' | 'closeButton' | 'position'
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
  dismiss: (id?: string) => string | undefined;
};
