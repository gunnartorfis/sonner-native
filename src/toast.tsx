import { CircleCheck, CircleX, Info, X } from 'lucide-react-native';
import * as React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ANIMATION_DURATION, useToastLayoutAnimations } from './animations';
import { useToastContext } from './context';
import { ToastSwipeHandler } from './gestures';
import { ToastVariant, type ToastProps } from './types';
import { useColors } from './use-colors';

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  element,
  description,
  duration: durationProps,
  variant,
  action,
  onHide,
  style,
  className,
  containerClassName,
  containerStyle,
  actionClassName,
  actionStyle,
  actionLabelClassName,
  actionLabelStyle,
  titleClassName,
  titleStyle,
  descriptionClassName,
  descriptionStyle,
  getIconColorForVariant: getIconColorForVariant,
  closeIconColor,
  promiseOptions,
}) => {
  const { duration: durationContext, addToast } = useToastContext();
  const duration = durationProps ?? durationContext;

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
          addToast(promiseOptions.success(data) ?? 'Success', {
            id,
            variant: ToastVariant.SUCCESS,
            promiseOptions: undefined,
          });
          isResolvingPromise.current = false;
        });
      } catch (error) {
        addToast(promiseOptions.error ?? 'Error', {
          id,
          variant: ToastVariant.ERROR,
          promiseOptions: undefined,
        });
        isResolvingPromise.current = false;
      }

      return;
    }

    // Start the timer only if it hasn't been started yet
    if (!timerStart.current) {
      timerStart.current = Date.now();
      timer.current = setTimeout(() => {
        if (!isDragging.current) {
          onHide?.(id);
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
  }, [duration, id, onHide, promiseOptions, addToast]);

  if (element) {
    return element;
  }

  return (
    <ToastSwipeHandler
      onRemove={() => {
        onHide?.(id);
      }}
      onBegin={() => {
        isDragging.current = true;
      }}
      onFinalize={() => {
        isDragging.current = false;
        const timeElapsed = Date.now() - timerStart.current!;

        if (timeElapsed < duration) {
          timer.current = setTimeout(() => {
            onHide?.(id);
          }, duration - timeElapsed);
        } else {
          onHide?.(id);
        }
      }}
      enabled={!promiseOptions}
      style={containerStyle}
      className={containerClassName}
    >
      <Animated.View
        className={className}
        style={[
          elevationStyle,
          style,
          {
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
          style={{
            flexDirection: 'row',
            gap: 16,
            alignItems: description?.length === 0 ? 'center' : undefined,
          }}
        >
          {promiseOptions ? (
            <ActivityIndicator />
          ) : (
            <ToastIcon
              variant={variant}
              getIconColorForVariant={getIconColorForVariant}
            />
          )}
          <View style={{ flex: 1 }}>
            <Text
              style={[
                {
                  fontWeight: '600',
                  lineHeight: 20,
                  color: colors['text-primary'],
                },
                titleStyle,
              ]}
              className={titleClassName}
            >
              {title}
            </Text>
            {description ? (
              <Text
                style={[
                  {
                    fontSize: 14,
                    lineHeight: 20,
                    marginTop: 2,
                    color: colors['text-tertiary'],
                  },
                  descriptionStyle,
                ]}
                className={descriptionClassName}
              >
                {description}
              </Text>
            ) : null}
            {action ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                  marginTop: 16,
                }}
              >
                <Pressable
                  onPress={action.onPress}
                  className={actionClassName}
                  style={[
                    {
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: colors['border-secondary'],
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderCurve: 'continuous',
                      backgroundColor: colors['background-secondary'],
                    },
                    actionStyle,
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      {
                        fontSize: 14,
                        lineHeight: 20,
                        fontWeight: '600',
                        color: colors['text-primary'],
                      },
                      actionLabelStyle,
                    ]}
                    className={actionLabelClassName}
                  >
                    {action.label}
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </View>
          <Pressable onPress={() => onHide?.(id)} hitSlop={10}>
            <X size={20} color={closeIconColor ?? colors['text-secondary']} />
          </Pressable>
        </View>
      </Animated.View>
    </ToastSwipeHandler>
  );
};

export const ToastIcon: React.FC<
  Pick<ToastProps, 'variant' | 'getIconColorForVariant'>
> = ({ variant, getIconColorForVariant: getIconColorForVariant }) => {
  const colors = useColors();
  switch (variant) {
    case 'success':
      return (
        <CircleCheck
          size={20}
          color={
            getIconColorForVariant?.(ToastVariant.SUCCESS) ?? colors.success
          }
        />
      );
    case 'error':
      return (
        <CircleX
          size={20}
          color={getIconColorForVariant?.(ToastVariant.SUCCESS) ?? colors.error}
        />
      );
    default:
    case 'info':
      return (
        <Info
          size={20}
          color={getIconColorForVariant?.(ToastVariant.INFO) ?? colors.info}
        />
      );
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
