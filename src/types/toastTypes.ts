export type ToastProps = {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  variant: 'success' | 'error' | 'info';
  action?: ToastAction;
  onHide?: () => void;
  className?: string;
  containerClassName?: string;
  getIconColorForVariant?: (variant: ToastVariant) => string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionClassName?: string;
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
  rootClassName?: string;
  toastContainerClassName?: string;
  toastContentClassName?: string;
  swipToDismissDirection?: ToastSwipeDirection;
} & Pick<
  ToastProps,
  | 'actionClassName'
  | 'actionLabelClassName'
  | 'descriptionClassName'
  | 'titleClassName'
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
  (title: string, options?: ToastFunctionOptions): string;
};
export type ToastUpdateFunction = (id: string, newToast: ToastProps) => void;
export type ToastFunctionWithVariant = (
  title: string,
  options?: Omit<ToastFunctionOptions, 'variant'>
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
