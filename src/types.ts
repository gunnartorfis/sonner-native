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

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'loading';

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastProps = StyleProps & {
  id: string | number;
  title: string;
  variant: ToastVariant;
  jsx?: React.ReactNode;
  description?: string;
  closeButton?: boolean;
  invert?: boolean;
  important?: boolean;
  duration?: number;
  position?: ToastPosition;
  dismissible?: boolean;
  icon?: React.ReactNode;
  action?: ToastAction | React.ReactNode;
  cancel?: ToastAction | React.ReactNode;
  onDismiss?: (id: string | number) => void;
  onAutoClose?: (id: string | number) => void;
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
  id?: string | number;
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
    warning?: React.ReactNode;
    info?: React.ReactNode;
    loading?: React.ReactNode;
  };
  swipToDismissDirection?: ToastSwipeDirection;
  pauseWhenPageIsHidden?: boolean;
  cn?: (...classes: Array<string | undefined>) => string;
};

export type AddToastContextHandler = (
  data: Omit<ToastProps, 'id'> & { id?: string | number }
) => string | number;

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
    | 'cn'
    | 'gap'
  >
> & {
  addToast: AddToastContextHandler;
};

export declare const toast: ((
  message: string,
  data?: ExternalToast
) => string | number) & {
  success: (message: string, data?: ExternalToast) => string | number;
  info: (message: string, data?: ExternalToast) => string | number;
  error: (message: string, data?: ExternalToast) => string | number;
  warning: (message: string, data?: ExternalToast) => string | number;
  custom: (jsx: React.ReactElement, data?: ExternalToast) => string | number;
  promise: <T>(
    promise: Promise<T>,
    options: Omit<PromiseOptions, 'promise'>
  ) => string | number;
  loading: (message: string, data?: ExternalToast) => string | number;
  dismiss: (id?: string | number) => string | number | undefined;
};
