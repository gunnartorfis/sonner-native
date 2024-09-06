import * as React from 'react';
import { Dimensions, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  LinearTransition,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { easeInOutCircFn } from './easings';
import { useToastContext } from './context';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

type ToastSwipeHandlerProps = {
  onRemove: () => void;
  style?: ViewStyle | (ViewStyle | undefined)[];
  className?: string;
  onBegin: () => void;
  onFinalize: () => void;
  enabled?: boolean;
};

export const ToastSwipeHandler: React.FC<
  React.PropsWithChildren<ToastSwipeHandlerProps>
> = ({
  children,
  onRemove,
  className,
  style,
  onBegin,
  onFinalize,
  enabled,
}) => {
  const translate = useSharedValue(0);
  const { swipToDismissDirection: direction, unstyled } = useToastContext();

  const pan = Gesture.Pan()
    .onBegin(() => {
      if (!enabled) {
        return;
      }
      runOnJS(onBegin)();
    })
    .onChange((event) => {
      if (!enabled) {
        return;
      }

      if (direction === 'left' && event.translationX < 0) {
        translate.value = event.translationX;
      } else if (direction === 'up') {
        translate.value = event.translationY;
      }
    })
    .onFinalize(() => {
      if (!enabled) {
        return;
      }

      const threshold = direction === 'left' ? -WINDOW_WIDTH * 0.25 : -16;
      const shouldDismiss = translate.value < threshold;

      if (shouldDismiss) {
        translate.value = withTiming(
          -WINDOW_WIDTH,
          {
            easing: Easing.inOut(Easing.ease),
          },
          (isDone) => {
            if (isDone) {
              runOnJS(onRemove)();
            }
          }
        );
      } else {
        translate.value = withTiming(0, {
          easing: Easing.elastic(0.8),
        });
      }
      runOnJS(onFinalize)();
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        direction === 'left'
          ? { translateX: translate.value }
          : { translateY: translate.value },
      ],
      opacity: interpolate(
        translate.value,
        [0, direction === 'left' ? -WINDOW_WIDTH : -60],
        [1, 0]
      ),
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          animatedStyle,
          unstyled
            ? undefined
            : {
                justifyContent: 'center',
                marginBottom: 16,
              },
          { width: '100%' },
          style,
        ]}
        className={className}
        layout={LinearTransition.easing(easeInOutCircFn)}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
