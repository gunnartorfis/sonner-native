import type { TextStyle, ViewStyle } from 'react-native';

export type ToastProps = {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  variant?: ToastVariant;
  action?: ToastAction;
  onHide?: () => void;
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

export enum ToastPosition {
  TOP_CENTER = 'top-center',
  BOTTOM_CENTER = 'bottom-center',
}

export enum ToastSwipeDirection {
  LEFT = 'left',
  UP = 'up',
}

export type ToastProviderProps = {
  duration?: number;
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
>;

export type ToastContextType = {
  addToast: ToastFunctionBase;
  updateToast: ToastUpdateFunction;
  duration: number;
  position: ToastPosition;
  swipToDismissDirection: ToastSwipeDirection;
};

export enum ToastVariant {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}

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
  action?: ToastAction;
  variant?: ToastVariant;
  description?: string;
  duration?: number;
  promiseOptions?: PromiseOptions;
};

export type ToastFunctionBase = {
  (title: string, options?: Omit<ToastProps, 'title' | 'id'>): string;
};

export type ToastUpdateFunction = (
  id: string,
  newToast: Omit<ToastProps, 'id'>
) => void;
export type ToastFunctionWithVariant = (
  title: string,
  options?: Omit<ToastProps, 'variant' | 'title' | 'id'>
) => string;
export type ToastFunctionPromise = <T>(
  promise: Promise<T>,
  options: Omit<PromiseOptions, 'promise'>
) => string;

export type ToastFunction = ToastFunctionBase & {
  success: ToastFunctionWithVariant;
  error: ToastFunctionWithVariant;
  info: ToastFunctionWithVariant;
  promise: ToastFunctionPromise;
};
