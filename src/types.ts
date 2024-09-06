import type { TextStyle, ViewStyle } from 'react-native';

export type ToastProps = {
  id: string;
  title: string;
  jsx?: React.ReactElement;
  description?: string;
  duration?: number;
  variant?: ToastVariant;
  action?: ToastAction;
  closeButton?: boolean;
  onDismiss?: (id: string) => void;
  onAutoClose?: (id: string) => void;
  dismissible?: boolean;
  style?: ViewStyle;
  className?: string;
  containerStyle?: ViewStyle;
  containerClassName?: string;
  getIconColorForVariant?: (variant: ToastVariant) => string;
  titleStyle?: TextStyle;
  titleClassName?: string;
  descriptionStyle?: TextStyle;
  descriptionClassName?: string;
  actionStyle?: ViewStyle;
  actionClassName?: string;
  actionLabelStyle?: TextStyle;
  actionLabelClassName?: string;
  closeIconColor?: string;
  promiseOptions?: PromiseOptions;
};

export type ToastPosition = 'top-center' | 'bottom-center';

export type ToastSwipeDirection = 'left' | 'up';

export type ToastProviderProps = {
  position?: ToastPosition;
  maxToasts?: number;
  rootStyle?: ViewStyle;
  rootClassName?: string;
  toastContainerStyle?: ViewStyle;
  toastContainerClassName?: string;
  toastContentStyle?: ViewStyle;
  toastContentClassName?: string;
  swipToDismissDirection?: ToastSwipeDirection;
} & Pick<
  ToastProps,
  | 'actionClassName'
  | 'actionLabelClassName'
  | 'descriptionClassName'
  | 'titleClassName'
  | 'actionStyle'
  | 'actionLabelStyle'
  | 'descriptionStyle'
  | 'titleStyle'
  | 'getIconColorForVariant'
  | 'closeIconColor'
  | 'closeButton'
  | 'dismissible'
  | 'duration'
>;

export type ToastContextType = {
  addToast: ToastFunctionContext;
  duration: number;
  position: ToastPosition;
  swipToDismissDirection: ToastSwipeDirection;
  closeButton: boolean;
  dismissible: boolean;
};

export type ToastVariant = 'success' | 'error' | 'info';

export type ToastAction = {
  label: string;
  onPress: () => void;
};

type PromiseOptions = {
  promise: Promise<unknown>;
  success: (result: unknown) => string;
  error: string;
  loading: string;
};

export type ToastFunctionOptions = {
  id?: string; // optional id to update existing toast
  action?: ToastAction;
  variant?: ToastVariant;
  description?: string;
  duration?: number;
  promiseOptions?: PromiseOptions;
  jsx?: React.ReactElement;
};

export type ToastFunctionBase = {
  (
    title: string,
    options?: Omit<ToastProps, 'title' | 'id' | 'variant'> & {
      id?: string; // optional id to update existing toast
    }
  ): string;
};

export type ToastFunctionContext = {
  (
    title: string,
    options?: Omit<ToastProps, 'title' | 'id'> & {
      id?: string; // optional id to update existing toast
    }
  ): string;
};

export type ToastFunctionWithVariant = (
  title: string,
  options?: Omit<ToastProps, 'variant' | 'title' | 'id'> & {
    id?: string; // optional id to update existing toast
  }
) => string;
export type ToastFunctionPromise = <T>(
  promise: Promise<T>,
  options: Omit<PromiseOptions, 'promise'>
) => string;
export type ToastFunctionCustom = (
  jsx: React.ReactElement,
  options?: Pick<ToastFunctionOptions, 'duration'>
) => string;
export type ToastDismiss = (id?: string) => void;

export type ToastFunction = ToastFunctionBase & {
  success: ToastFunctionWithVariant;
  error: ToastFunctionWithVariant;
  info: ToastFunctionWithVariant;
  promise: ToastFunctionPromise;
  custom: ToastFunctionCustom;
  dismiss: ToastDismiss;
};
