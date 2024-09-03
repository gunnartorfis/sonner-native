import { CircleCheck, CircleX, Info, X } from 'lucide-react-native';
import * as React from 'react';
import type { ViewStyle } from 'react-native';
import { ActivityIndicator, Pressable, View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { cn } from '@/utils/tailwind-utils';
import { ToastVariant, type ToastProps } from '@/types/toastTypes';
import { useToastContext } from '@/components/toast/ToastContext';
import {
  ANIMATION_DURATION,
  useToastLayoutAnimations,
} from '@/components/toast/toastAnimations';
import { ToastSwipeHandler } from '@/components/toast/ToastSwipeHandler';

const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  duration: durationProps,
  variant,
  action,
  onHide,
  className,
  containerClassName,
  actionClassName,
  actionLabelClassName,
  titleClassName,
  descriptionClassName,
  getIconColorForVariant: getIconColorForVariant,
  closeIconColor,
  promiseOptions,
}) => {
  const { duration: durationContext, updateToast } = useToastContext();
  const duration = durationProps ?? durationContext;

  const isDragging = React.useRef(false);
  const timer = React.useRef<NodeJS.Timeout>();
  const timerStart = React.useRef<number | undefined>();
  const isResolvingPromise = React.useRef(false);

  React.useEffect(() => {
    if (promiseOptions?.promise) {
      try {
        isResolvingPromise.current = true;
        promiseOptions.promise.then((data) => {
          updateToast(id, {
            title: promiseOptions.success(data) ?? 'Success',
            variant: ToastVariant.SUCCESS,
            promiseOptions: undefined,
            id,
          });
          isResolvingPromise.current = false;
        });
      } catch (error) {
        updateToast(id, {
          title: promiseOptions.error ?? 'Success',
          variant: ToastVariant.SUCCESS,
          id,
          promiseOptions: undefined,
        });
        isResolvingPromise.current = false;
      }

      return;
    }

    timerStart.current = Date.now();
    timer.current = setTimeout(() => {
      if (!isDragging.current) {
        onHide?.();
        timerStart.current = undefined;
      }
    }, ANIMATION_DURATION + duration); // Auto-hide after 3 seconds

    return () => clearTimeout(timer.current);
  }, [duration, id, onHide, promiseOptions, updateToast]);

  const { entering, exiting } = useToastLayoutAnimations();

  return (
    <ToastSwipeHandler
      onRemove={() => {
        onHide?.();
      }}
      onBegin={() => {
        isDragging.current = true;
      }}
      onFinalize={() => {
        isDragging.current = false;
        const timeElapsed = Date.now() - timerStart.current!;

        if (timeElapsed < duration) {
          timer.current = setTimeout(() => {
            onHide?.();
          }, duration - timeElapsed);
        } else {
          onHide?.();
        }
      }}
      enabled={!promiseOptions}
      className={cn('w-full', containerClassName)}
    >
      <Animated.View
        className={cn('p-4 rounded-2xl mb-4 mx-4', className)}
        style={elevationStyle}
        entering={entering}
        exiting={exiting}
      >
        <View
          className={cn('flex flex-row gap-4', {
            'items-center': description?.length === 0,
          })}
        >
          {promiseOptions ? (
            <ActivityIndicator />
          ) : (
            <ToastIcon
              variant={variant}
              getIconColorForVariant={getIconColorForVariant}
            />
          )}
          <View className="flex-1">
            <Text className={cn('font-semibold leading-5', titleClassName)}>
              {title}
            </Text>
            {description ? (
              <Text className={cn('text-sm mt-[2px]', descriptionClassName)}>
                {description}
              </Text>
            ) : null}
            {action ? (
              <View className="flex flex-row items-center gap-4 mt-4">
                <Pressable
                  onPress={action.onPress}
                  className={cn(
                    'rounded-full border px-2 py-1',
                    actionClassName
                  )}
                  style={{
                    borderCurve: 'continuous',
                  }}
                >
                  <Text
                    numberOfLines={1}
                    className={cn(
                      'text-sm font-semibold',
                      actionLabelClassName
                    )}
                  >
                    {action.label}
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </View>
          <Pressable onPress={onHide} hitSlop={10}>
            <X size={20} color={closeIconColor ?? '#ccc'} />
          </Pressable>
        </View>
      </Animated.View>
    </ToastSwipeHandler>
  );
};

export const ToastIcon: React.FC<
  Pick<ToastProps, 'variant' | 'getIconColorForVariant'>
> = ({ variant, getIconColorForVariant: getIconColorForVariant }) => {
  switch (variant) {
    case 'success':
      return (
        <CircleCheck
          size={20}
          color={getIconColorForVariant?.(ToastVariant.SUCCESS) ?? '#fff'}
        />
      );
    case 'error':
      return (
        <CircleX
          size={20}
          color={getIconColorForVariant?.(ToastVariant.SUCCESS) ?? '#fff'}
        />
      );
    default:
    case 'info':
      return (
        <Info
          size={20}
          color={getIconColorForVariant?.(ToastVariant.INFO) ?? '#fff'}
        />
      );
  }
};

const elevationStyle = {
  borderCurve: 'continuous' as ViewStyle['borderCurve'],
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 7,
  },
  shadowOpacity: 0.43,
  shadowRadius: 9.51,

  elevation: 15,
};

export default Toast;
