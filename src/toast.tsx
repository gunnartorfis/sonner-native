import { CircleCheck, CircleX, Info, TriangleAlert, X } from './icons';
import * as React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { ANIMATION_DURATION, useToastLayoutAnimations } from './animations';
import { toastDefaultValues } from './constants';
import { useToastContext } from './context';
import { ToastSwipeHandler } from './gestures';
import { isToastAction, type ToastProps } from './types';
import { useAppStateListener } from './use-app-state';
import { useColors } from './use-colors';

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  jsx,
  description,
  icon,
  duration: durationProps,
  variant,
  action,
  cancel,
  onDismiss,
  onAutoClose,
  dismissible = toastDefaultValues.dismissible,
  closeButton: closeButtonProps,
  actionButtonStyle,
  actionButtonTextStyle,
  actionButtonClassName,
  actionButtonTextClassName,
  cancelButtonStyle,
  cancelButtonTextStyle,
  cancelButtonClassName,
  cancelButtonTextClassName,
  style,
  className,
  classNames,
  styles,
  promiseOptions,
  position,
  unstyled: unstyledProps,
  important,
  invert: invertProps,
}) => {
  const {
    duration: durationCtx,
    addToast,
    closeButton: closeButtonCtx,
    unstyled: unstyledCtx,
    styles: stylesCtx,
    classNames: classNamesCtx,
    icons,
    pauseWhenPageIsHidden,
    cn,
    invert: invertCtx,
  } = useToastContext();
  const invert = invertProps ?? invertCtx;

  const unstyled = unstyledProps ?? unstyledCtx;
  const duration = durationProps ?? durationCtx;
  const closeButton = closeButtonProps ?? closeButtonCtx;

  const colors = useColors(invert);
  const { entering, exiting } = useToastLayoutAnimations(position);

  const isDragging = React.useRef(false);
  const timer = React.useRef<NodeJS.Timeout>();
  const timerStart = React.useRef<number | undefined>();
  const timeLeftOnceBackgrounded = React.useRef<number | undefined>();
  const isResolvingPromise = React.useRef(false);

  const onBackground = React.useCallback(() => {
    if (!pauseWhenPageIsHidden) {
      return;
    }

    if (timer.current) {
      timeLeftOnceBackgrounded.current =
        duration - (Date.now() - timerStart.current!);
      clearTimeout(timer.current);
      timer.current = undefined;
      timerStart.current = undefined;
    }
  }, [duration, pauseWhenPageIsHidden]);

  const onForeground = React.useCallback(() => {
    if (!pauseWhenPageIsHidden) {
      return;
    }

    if (
      timeLeftOnceBackgrounded.current &&
      timeLeftOnceBackgrounded.current > 0
    ) {
      timer.current = setTimeout(
        () => {
          if (!isDragging.current) {
            onAutoClose?.(id);
          }
        },
        Math.max(timeLeftOnceBackgrounded.current, 1000) // minimum 1 second to avoid weird behavior
      );
    } else {
      onAutoClose?.(id);
    }
  }, [id, onAutoClose, pauseWhenPageIsHidden]);

  useAppStateListener(
    React.useMemo(
      () => ({
        onBackground,
        onForeground,
      }),
      [onBackground, onForeground]
    )
  );

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
  }, [duration, id, onDismiss, promiseOptions, addToast, onAutoClose]);

  React.useEffect(() => {
    // Cleanup function to clear the timer if it's still the same timer
    return () => {
      clearTimeout(timer.current);
      timer.current = undefined;
      timerStart.current = undefined;
    };
  }, [id]);

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
      style={[stylesCtx.toastContainer, styles?.toastContainer]}
      className={cn(classNamesCtx.toastContainer, classNames?.toastContainer)}
      unstyled={unstyled}
      important={important}
    >
      <Animated.View
        className={cn(className, classNamesCtx.toast, classNames?.toast)}
        style={[
          !unstyled && toastStyles.elevationStyle,
          stylesCtx.toast,
          styles?.toast,
          style,
          !unstyled && [
            toastStyles.animatedWrapper,
            { backgroundColor: colors['background-primary'] },
          ],
        ]}
        entering={entering}
        exiting={exiting}
      >
        <View
          style={[
            !unstyled && [
              toastStyles.container,
              {
                alignItems: description?.length === 0 ? 'center' : undefined,
              },
            ],
            stylesCtx.toastContent,
            styles?.toastContent,
          ]}
          className={cn(classNamesCtx.toastContent, classNames?.toastContent)}
        >
          {promiseOptions || variant === 'loading' ? (
            'loading' in icons ? (
              icons.loading
            ) : (
              <ActivityIndicator />
            )
          ) : icon || variant in icons ? (
            icons[variant]
          ) : (
            <ToastIcon variant={variant} invert={invert} />
          )}
          <View style={toastStyles.full}>
            <Text
              style={[
                !unstyled && [
                  toastStyles.title,
                  {
                    color: colors['text-primary'],
                  },
                ],
                stylesCtx.title,
                styles?.title,
              ]}
              className={cn(classNamesCtx.title, classNames?.title)}
            >
              {title}
            </Text>
            {description ? (
              <Text
                style={[
                  !unstyled && [
                    toastStyles.description,
                    {
                      color: colors['text-tertiary'],
                    },
                  ],
                  stylesCtx.description,
                  styles?.description,
                ]}
                className={cn(
                  classNamesCtx.description,
                  classNames?.description
                )}
              >
                {description}
              </Text>
            ) : null}
            <View
              style={[
                !unstyled && !(!action && !cancel) && toastStyles.buttonWrapper,
                stylesCtx.buttons,
                styles?.buttons,
              ]}
              className={cn(classNamesCtx.buttons, classNames?.buttons)}
            >
              {isToastAction(action) ? (
                <Pressable
                  onPress={action.onClick}
                  className={actionButtonClassName}
                  style={[
                    !unstyled && [
                      toastStyles.actionButton,
                      {
                        borderColor: colors['border-secondary'],
                        backgroundColor: colors['background-secondary'],
                      },
                    ],
                    actionButtonStyle,
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      !unstyled && [
                        toastStyles.label,
                        {
                          color: colors['text-primary'],
                        },
                      ],
                      actionButtonTextStyle,
                    ]}
                    className={actionButtonTextClassName}
                  >
                    {action.label}
                  </Text>
                </Pressable>
              ) : (
                action || undefined
              )}
              {isToastAction(cancel) ? (
                <Pressable
                  onPress={() => {
                    cancel.onClick();
                    onDismiss?.(id);
                  }}
                  className={cancelButtonClassName}
                  style={[
                    !unstyled && toastStyles.cancelButton,
                    cancelButtonStyle,
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      !unstyled && [
                        toastStyles.cancelLabel,
                        {
                          color: colors['text-secondary'],
                        },
                      ],
                      cancelButtonTextStyle,
                    ]}
                    className={cancelButtonTextClassName}
                  >
                    {cancel.label}
                  </Text>
                </Pressable>
              ) : (
                cancel || undefined
              )}
            </View>
          </View>
          {closeButton && dismissible ? (
            <Pressable
              onPress={() => onDismiss?.(id)}
              hitSlop={10}
              style={[stylesCtx.closeButton, styles?.closeButton]}
              className={cn(classNamesCtx.closeButton, classNames?.closeButton)}
            >
              <X
                size={20}
                color={colors['text-secondary']}
                style={[stylesCtx.closeButtonIcon, styles?.closeButtonIcon]}
                className={cn(
                  classNamesCtx.closeButtonIcon,
                  classNames?.closeButtonIcon
                )}
              />
            </Pressable>
          ) : null}
        </View>
      </Animated.View>
    </ToastSwipeHandler>
  );
};

export const ToastIcon: React.FC<Pick<ToastProps, 'variant' | 'invert'>> = ({
  variant,
  invert,
}) => {
  const colors = useColors(invert);
  switch (variant) {
    case 'success':
      return <CircleCheck size={20} color={colors.success} />;
    case 'error':
      return <CircleX size={20} color={colors.error} />;
    case 'warning':
      return <TriangleAlert size={20} color={colors.warning} />;
    default:
    case 'info':
      return <Info size={20} color={colors.info} />;
  }
};

const toastStyles = StyleSheet.create({
  elevationStyle: {
    shadowOpacity: 0.0015 * 4 + 0.1,
    shadowRadius: 3 * 4,
    shadowOffset: {
      height: 4,
      width: 0,
    },
    elevation: 4,
  },
  animatedWrapper: {
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    borderCurve: 'continuous',
  },
  container: {
    flexDirection: 'row',
    gap: 16,
  },
  full: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
  },
  actionButton: {
    flexGrow: 0,
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderCurve: 'continuous',
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },
  cancelButton: {
    flexGrow: 0,
  },
  cancelLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },
});
