import * as React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type ViewProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { ANIMATION_DURATION, useToastLayoutAnimations } from './animations';
import { toastDefaultValues } from './constants';
import { useToastContext } from './context';
import { easeOutQuartFn } from './easings';
import { ToastSwipeHandler } from './gestures';
import { CircleCheck, CircleX, Info, TriangleAlert, X } from './icons';
import { toastStore } from './toast-store';
import { isToastAction, type ToastProps, type ToastRef } from './types';
import { useAppStateListener } from './use-app-state';
import { useDefaultStyles, type DefaultStyles } from './use-default-styles';
import { useToastPosition } from './use-toast-position';
import { isPressNearCloseButton } from './press-utils';

export const Toast = React.forwardRef<ToastRef, ToastProps>(
  (
    {
      id,
      title,
      jsx,
      description,
      icon,
      duration: durationProps,
      variant,
      action,
      cancel,
      close,
      onDismiss,
      dismissible = toastDefaultValues.dismissible,
      closeButton: closeButtonProps,
      actionButtonStyle,
      actionButtonTextStyle,
      cancelButtonStyle,
      cancelButtonTextStyle,
      style,
      styles,
      promiseOptions,
      position,
      unstyled: unstyledProps,
      important,
      invert: invertProps,
      richColors: richColorsProps,
      onPress,
      numberOfToasts,
      index,
    },
    ref
  ) => {
    const {
      duration: durationCtx,
      closeButton: closeButtonCtx,
      icons,
      pauseWhenPageIsHidden,
      invert: invertCtx,
      richColors: richColorsCtx,
      enableStacking,
      newestToastHeightShared,
      toastHeights,
      gap,
      position: positionCtx,
      isExpanded,
      toggleExpand,
      toastOptions: {
        unstyled: unstyledCtx,
        toastContainerStyle: toastContainerStyleCtx,
        actionButtonStyle: actionButtonStyleCtx,
        actionButtonTextStyle: actionButtonTextStyleCtx,
        cancelButtonStyle: cancelButtonStyleCtx,
        cancelButtonTextStyle: cancelButtonTextStyleCtx,
        style: toastStyleCtx,
        toastContentStyle: toastContentStyleCtx,
        titleStyle: titleStyleCtx,
        descriptionStyle: descriptionStyleCtx,
        buttonsStyle: buttonsStyleCtx,
        closeButtonStyle: closeButtonStyleCtx,
        closeButtonIconStyle: closeButtonIconStyleCtx,
      },
    } = useToastContext();
    const invert = invertProps ?? invertCtx;
    const richColors = richColorsProps ?? richColorsCtx;
    const unstyled = unstyledProps ?? unstyledCtx;
    const duration = durationProps ?? durationCtx;
    const closeButton = closeButtonProps ?? closeButtonCtx;

    const { visibleToasts: visibleToastsCtx } = useToastContext();

    // Determine if this toast should be hidden due to visibility limit
    const isHiddenByLimit =
      enableStacking &&
      index + 1 >= (visibleToastsCtx ?? toastDefaultValues.visibleToasts);

    const { entering, exiting } = useToastLayoutAnimations(
      position,
      isHiddenByLimit,
      numberOfToasts
    );

    // Get all toasts to build ordered IDs for position calculation
    const allToasts = React.useSyncExternalStore(
      toastStore.subscribe,
      toastStore.getSnapshot,
      toastStore.getSnapshot
    ).toasts;

    // Build ordered toast IDs based on position for correct stacking
    const toastPosition = position ?? positionCtx;
    const orderedToastIds = (() => {
      if (enableStacking) {
        // Match the rendering order from toaster.tsx
        return toastPosition === 'top-center'
          ? allToasts.map((t) => t.id).reverse()
          : allToasts.map((t) => t.id);
      }
      return toastPosition === 'bottom-center'
        ? allToasts.map((t) => t.id)
        : allToasts.map((t) => t.id).reverse();
    })();

    // Calculate absolute position for this toast
    const yPosition = useToastPosition({
      id,
      index,
      numberOfToasts,
      enableStacking,
      position: toastPosition,
      allToastHeights: toastHeights,
      gap,
      orderedToastIds,
      isExpanded,
    });

    const isDragging = React.useRef(false);
    // Type the ref to include getBoundingClientRect from New Architecture
    const toastRef = React.useRef<
      View & {
        getBoundingClientRect?: () => {
          x: number;
          y: number;
          width: number;
          height: number;
        };
      }
    >(null);

    const wiggleSharedValue = useSharedValue(1);

    const wiggleAnimationStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: wiggleSharedValue.value }],
      };
    }, [wiggleSharedValue]);

    // Absolute positioning style for toasts
    const absolutePositionStyle = useAnimatedStyle(() => {
      return {
        position: 'absolute',
        width: '100%',
        transform: [{ translateY: yPosition.value }],
      };
    }, [yPosition]);

    // Horizontal margin for stacking effect
    const horizontalMargin = useDerivedValue(() => {
      'worklet';
      // When expanded, remove horizontal margin
      if (!enableStacking || numberOfToasts <= 1 || isExpanded) {
        return withTiming(0, {
          duration: ANIMATION_DURATION,
          easing: easeOutQuartFn,
        });
      }

      // Use same stackGap as vertical positioning for proportional animation
      const stackGap = toastDefaultValues.stackGap;

      // Calculate multiplier based on position to match vertical stacking
      const multiplier =
        toastPosition === 'top-center'
          ? index // Top: newest (index 0) has 0 margin, older have more
          : numberOfToasts - index - 1; // Bottom: newest (highest index) has 0 margin

      return withTiming(stackGap * multiplier, {
        duration: ANIMATION_DURATION,
        easing: easeOutQuartFn,
      });
    }, [enableStacking, numberOfToasts, index, toastPosition, isExpanded]);

    const horizontalStackingStyle = useAnimatedStyle(() => {
      return {
        marginHorizontal: horizontalMargin.value,
      };
    }, [horizontalMargin]);

    const wiggle = () => {
      'worklet';

      wiggleSharedValue.set((value) => {
        return withRepeat(
          withTiming(Math.min(value * 1.035, 1.035), {
            duration: 150,
          }),
          4,
          true
        );
      });
    };

    const wiggleHandler = () => {
      // we can't send Infinity over to the native layer.
      if (duration === Infinity) {
        return;
      }

      if (wiggleSharedValue.value !== 1) {
        // we should animate back to 1 and then wiggle
        wiggleSharedValue.set(() => {
          return withTiming(1, { duration: 150 }, wiggle);
        });
      } else {
        wiggle();
      }
    };

    React.useImperativeHandle(ref, () => ({
      wiggle: wiggleHandler,
    }));

    // Measure toast height synchronously and report to store
    React.useLayoutEffect(() => {
      if (!enableStacking || !toastRef.current) {
        return;
      }

      toastRef.current.measureInWindow?.((_, __, ___, height) => {
        toastStore.setToastHeight(id, height);
        // If this is the newest toast, update the shared value
        if (index === numberOfToasts - 1) {
          newestToastHeightShared.value = height;
        }
      });
    }, [enableStacking, id, index, numberOfToasts, newestToastHeightShared]);

    // Handle app state changes - pause/resume timers
    const onBackground = () => {
      if (!pauseWhenPageIsHidden) {
        return;
      }
      toastStore.pauseTimer(id);
    };

    const onForeground = () => {
      if (!pauseWhenPageIsHidden) {
        return;
      }
      toastStore.resumeTimer(id);
    };

    useAppStateListener({
      onBackground,
      onForeground,
    });

    const defaultStyles = useDefaultStyles({
      invert,
      richColors,
      unstyled,
      description,
      variant,
    });

    const toastSwipeHandlerProps = {
      onRemove: () => {
        onDismiss?.(id);
      },
      onBegin: () => {
        isDragging.current = true;
        // Pause timer when dragging starts
        toastStore.pauseTimer(id);
      },
      onFinalize: () => {
        isDragging.current = false;
        // Resume timer when dragging ends (only if not expanded)
        if (!isExpanded) {
          toastStore.resumeTimer(id);
        }
      },
      onPress: ({ x }: { x: number; y: number }) => {
        // Only allow expanding/collapsing when:
        // - Stacking is enabled and there are multiple toasts
        // - Press is not near the close button area
        // - Position is not center (no stacking for center)
        const toastPosition = position || positionCtx;
        if (
          enableStacking &&
          numberOfToasts > 1 &&
          !isPressNearCloseButton({ x }) &&
          toastPosition !== 'center'
        ) {
          toggleExpand();
        }
        // Call user's onPress handler if provided
        onPress?.();
      },
      enabled: !promiseOptions && dismissible,
      style: [toastContainerStyleCtx, styles?.toastContainer],
      unstyled: unstyled,
      important: important,
      position: position,
      numberOfToasts,
    };

    if (jsx) {
      return (
        <ToastSwipeHandler {...toastSwipeHandlerProps} index={index}>
          <Animated.View style={absolutePositionStyle}>
            <Animated.View
              ref={toastRef}
              style={horizontalStackingStyle}
              entering={entering}
              exiting={exiting}
            >
              {jsx}
            </Animated.View>
          </Animated.View>
        </ToastSwipeHandler>
      );
    }

    return (
      <ToastSwipeHandler
        {...toastSwipeHandlerProps}
        index={index}
        numberOfToasts={numberOfToasts}
      >
        <Animated.View style={absolutePositionStyle}>
          <Animated.View
            style={[wiggleAnimationStyle, horizontalStackingStyle]}
          >
            <Animated.View
              ref={toastRef}
              style={[
                unstyled ? undefined : elevationStyle,
                defaultStyles.toast,
                toastStyleCtx,
                styles?.toast,
                style,
              ]}
              entering={entering}
              exiting={exiting}
            >
              <View
                style={[
                  defaultStyles.toastContent,
                  toastContentStyleCtx,
                  styles?.toastContent,
                ]}
              >
                {promiseOptions || variant === 'loading' ? (
                  'loading' in icons ? (
                    icons.loading
                  ) : (
                    <ActivityIndicator />
                  )
                ) : icon ? (
                  <View>{icon}</View>
                ) : variant in icons ? (
                  icons[variant]
                ) : (
                  <ToastIcon
                    variant={variant}
                    invert={invert}
                    richColors={richColors}
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Text
                    style={[defaultStyles.title, titleStyleCtx, styles?.title]}
                  >
                    {title}
                  </Text>
                  {description ? (
                    <Text
                      style={[
                        defaultStyles.description,
                        descriptionStyleCtx,
                        styles?.description,
                      ]}
                    >
                      {description}
                    </Text>
                  ) : null}
                  <View
                    style={[
                      unstyled || (!action && !cancel)
                        ? undefined
                        : defaultStyles.buttons,
                      buttonsStyleCtx,
                      styles?.buttons,
                    ]}
                  >
                    {isToastAction(action) ? (
                      <Pressable
                        onPress={action.onClick}
                        style={[
                          defaultStyles.actionButton,
                          actionButtonStyleCtx,
                          actionButtonStyle,
                        ]}
                      >
                        <Text
                          numberOfLines={1}
                          style={[
                            defaultStyles.actionButtonText,
                            actionButtonTextStyleCtx,
                            actionButtonTextStyle,
                          ]}
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
                        style={[
                          defaultStyles.cancelButton,
                          cancelButtonStyleCtx,
                          cancelButtonStyle,
                        ]}
                      >
                        <Text
                          numberOfLines={1}
                          style={[
                            defaultStyles.cancelButtonText,
                            cancelButtonTextStyleCtx,
                            cancelButtonTextStyle,
                          ]}
                        >
                          {cancel.label}
                        </Text>
                      </Pressable>
                    ) : (
                      cancel || undefined
                    )}
                  </View>
                </View>
                <CloseButton
                  dismissible={dismissible}
                  close={close}
                  closeButton={closeButton}
                  onDismiss={onDismiss}
                  id={id}
                  styles={styles}
                  closeButtonStyle={[closeButtonStyleCtx, styles?.closeButton]}
                  closeButtonIconStyle={[
                    closeButtonIconStyleCtx,
                    styles?.closeButtonIcon,
                  ]}
                  defaultStyles={defaultStyles}
                />
              </View>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </ToastSwipeHandler>
    );
  }
);

Toast.displayName = 'Toast';

export const ToastIcon: React.FC<
  Pick<ToastProps, 'variant'> & {
    invert: boolean;
    richColors: boolean;
  }
> = ({ variant, invert, richColors }) => {
  const color = useDefaultStyles({
    variant,
    invert,
    richColors,
    unstyled: false,
    description: undefined,
  }).iconColor;

  switch (variant) {
    case 'success':
      return <CircleCheck size={20} color={color} />;
    case 'error':
      return <CircleX size={20} color={color} />;
    case 'warning':
      return <TriangleAlert size={20} color={color} />;
    default:
    case 'info':
      return <Info size={20} color={color} />;
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

const CloseButton: React.FC<{
  dismissible: ToastProps['dismissible'];
  close: ToastProps['close'];
  closeButton: ToastProps['closeButton'];
  onDismiss: ToastProps['onDismiss'];
  id: ToastProps['id'];
  styles: ToastProps['styles'];
  closeButtonStyle?: ViewProps['style'];
  closeButtonIconStyle?: ViewProps['style'];
  defaultStyles: DefaultStyles;
}> = ({
  dismissible,
  close,
  closeButton,
  onDismiss,
  id,
  closeButtonStyle,
  defaultStyles,
  closeButtonIconStyle,
}) => {
  if (!dismissible) {
    return null;
  }

  if (close) {
    return close;
  }

  if (closeButton) {
    return (
      <Pressable
        onPress={() => onDismiss?.(id)}
        hitSlop={10}
        style={closeButtonStyle}
      >
        <X
          size={20}
          color={defaultStyles.closeButtonColor}
          style={closeButtonIconStyle}
        />
      </Pressable>
    );
  }
  return null;
};
