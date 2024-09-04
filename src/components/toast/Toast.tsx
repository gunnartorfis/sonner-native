import {
  ANIMATION_DURATION,
  useToastLayoutAnimations,
} from '@/components/toast/toastAnimations';
import { useToastContext } from '@/components/toast/ToastContext';
import { ToastSwipeHandler } from '@/components/toast/ToastSwipeHandler';
import { ToastVariant, type ToastProps } from '@/types/toastTypes';
import { CircleCheck, CircleX, Info, X } from 'lucide-react-native';
import * as React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

const Toast: React.FC<ToastProps> = ({
  id,
  title,
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
      style={containerStyle}
      className={containerClassName}
    >
      <Animated.View
        className={className}
        style={[
          elevationStyle,
          {
            padding: 16,
            borderRadius: 16,
            marginBottom: 16,
            marginHorizontal: 16,
            backgroundColor: '#fff',
            borderCurve: 'continuous',
          },
          style,
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
                  color: '#232020',
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
                    color: '#4f4a4a',
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
                      borderColor: '#e6e3e3',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderCurve: 'continuous',
                      backgroundColor: '#f7f7f7',
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
                        color: '##232020',
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
          <Pressable onPress={onHide} hitSlop={10}>
            <X size={20} color={closeIconColor ?? '#3f3b3b'} />
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
          color={getIconColorForVariant?.(ToastVariant.SUCCESS) ?? '#3c8643'}
        />
      );
    case 'error':
      return (
        <CircleX
          size={20}
          color={getIconColorForVariant?.(ToastVariant.SUCCESS) ?? '#ff3a41'}
        />
      );
    default:
    case 'info':
      return (
        <Info
          size={20}
          color={getIconColorForVariant?.(ToastVariant.INFO) ?? '#286efa'}
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

export default Toast;
