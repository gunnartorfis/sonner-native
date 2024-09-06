import { CircleCheck, CircleX, Info, X } from 'lucide-react-native';
import * as React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ANIMATION_DURATION, useToastLayoutAnimations } from './animations';
import { useToastContext } from './context';
import { ToastSwipeHandler } from './gestures';
import { type ToastProps } from './types';
import { useColors } from './use-colors';
import { toastDefaultValues } from 'src/constants';
import { cn } from 'src/tailwind-utils';

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  jsx,
  description,
  duration: durationProps,
  variant,
  action,
  onDismiss,
  onAutoClose,
  dismissible = toastDefaultValues.dismissible,
  closeButton: closeButtonProps,
  style,
  className,
  classNames,
  styles,
  promiseOptions,
}) => {
  const {
    duration: durationCtx,
    addToast,
    closeButton: closeButtonCtx,
    unstyled,
    styles: stylesCtx,
    classNames: classNamesCtx,
  } = useToastContext();
  const duration = durationProps ?? durationCtx;
  const closeButton = closeButtonProps ?? closeButtonCtx;

  const colors = useColors();
  const { entering, exiting } = useToastLayoutAnimations();

  const isDragging = React.useRef(false);
  const timer = React.useRef<NodeJS.Timeout>();
  const timerStart = React.useRef<number | undefined>();
  const isResolvingPromise = React.useRef(false);

  React.useEffect(() => {
    if (isResolvingPromise.current) {
      return;
    }

    if (promiseOptions?.promise) {
      try {
        isResolvingPromise.current = true;
        promiseOptions.promise.then((data) => {
          addToast({
            title: promiseOptions.success(data) ?? 'Success',
            id,
            variant: 'success',
            promiseOptions: undefined,
          });
          isResolvingPromise.current = false;
        });
      } catch (error) {
        addToast({
          title: promiseOptions.error ?? 'Error',
          id,
          variant: 'error',
          promiseOptions: undefined,
        });
        isResolvingPromise.current = false;
      }

      return;
    }

    if (duration === Infinity) {
      return;
    }

    // Start the timer only if it hasn't been started yet
    if (!timerStart.current) {
      timerStart.current = Date.now();
      timer.current = setTimeout(() => {
        if (!isDragging.current) {
          onAutoClose?.(id);
        }
      }, ANIMATION_DURATION + duration);
    }

    // Cleanup function to clear the timer if it's still the same timer
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = undefined;
        timerStart.current = undefined;
      }
    };
  }, [duration, id, onDismiss, promiseOptions, addToast, onAutoClose]);

  if (jsx) {
    return jsx;
  }

  return (
    <ToastSwipeHandler
      onRemove={() => {
        onDismiss?.(id);
      }}
      onBegin={() => {
        isDragging.current = true;
      }}
      onFinalize={() => {
        isDragging.current = false;
        const timeElapsed = Date.now() - timerStart.current!;

        if (timeElapsed < duration) {
          timer.current = setTimeout(() => {
            onDismiss?.(id);
          }, duration - timeElapsed);
        } else {
          onDismiss?.(id);
        }
      }}
      enabled={!promiseOptions && dismissible}
    >
      <Animated.View
        className={className}
        style={[
          unstyled ? undefined : elevationStyle,
          style,
          unstyled
            ? undefined
            : {
                justifyContent: 'center',
                padding: 16,
                borderRadius: 16,
                marginHorizontal: 16,
                backgroundColor: colors['background-primary'],
                borderCurve: 'continuous',
              },
        ]}
        entering={entering}
        exiting={exiting}
      >
        <View
          style={
            unstyled
              ? undefined
              : {
                  flexDirection: 'row',
                  gap: 16,
                  alignItems: description?.length === 0 ? 'center' : undefined,
                }
          }
        >
          {promiseOptions ? (
            <ActivityIndicator />
          ) : (
            <ToastIcon variant={variant} />
          )}
          <View style={unstyled ? undefined : { flex: 1 }}>
            <Text
              style={[
                unstyled
                  ? undefined
                  : {
                      fontWeight: '600',
                      lineHeight: 20,
                      color: colors['text-primary'],
                    },
                styles?.title,
              ]}
              className={classNames?.title}
            >
              {title}
            </Text>
            {description ? (
              <Text
                style={[
                  unstyled
                    ? undefined
                    : {
                        fontSize: 14,
                        lineHeight: 20,
                        marginTop: 2,
                        color: colors['text-tertiary'],
                      },
                  styles?.description,
                ]}
                className={classNames?.description}
              >
                {description}
              </Text>
            ) : null}
            {action ? (
              <View
                style={
                  unstyled
                    ? undefined
                    : {
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 16,
                        marginTop: 16,
                      }
                }
              >
                <Pressable
                  onPress={action.onPress}
                  className={cn(
                    classNamesCtx.actionButton,
                    classNames?.actionButton
                  )}
                  style={[
                    unstyled
                      ? undefined
                      : {
                          borderRadius: 999,
                          borderWidth: 1,
                          borderColor: colors['border-secondary'],
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderCurve: 'continuous',
                          backgroundColor: colors['background-secondary'],
                        },
                    stylesCtx?.actionButton,
                    styles?.actionButton,
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      unstyled
                        ? undefined
                        : {
                            fontSize: 14,
                            lineHeight: 20,
                            fontWeight: '600',
                            color: colors['text-primary'],
                          },
                      stylesCtx.actionButtonText,
                      styles?.actionButtonText,
                    ]}
                    className={cn(
                      classNamesCtx?.actionButtonText,
                      classNames?.actionButtonText
                    )}
                  >
                    {action.label}
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </View>
          {closeButton && dismissible ? (
            <Pressable onPress={() => onDismiss?.(id)} hitSlop={10}>
              <X size={20} color={colors['text-secondary']} />
            </Pressable>
          ) : null}
        </View>
      </Animated.View>
    </ToastSwipeHandler>
  );
};

export const ToastIcon: React.FC<Pick<ToastProps, 'variant'>> = ({
  variant,
}) => {
  const colors = useColors();
  switch (variant) {
    case 'success':
      return <CircleCheck size={20} color={colors.success} />;
    case 'error':
      return <CircleX size={20} color={colors.error} />;
    default:
    case 'info':
      return <Info size={20} color={colors.info} />;
  }
};

const elevationStyle = {
  shadowOpacity: 0.0015 * 4 + 0.1,
  shadowRadius: 3 * 4,
  shadowOffset: {
    height: 4,
    width: 0,
  },
  elevation: 4,
};
