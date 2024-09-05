import { useToastContext } from './context';
import { ToastPosition } from './types';
import React from 'react';
import { Easing, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ANIMATION_DURATION = 300;
const easing = Easing.inOut(Easing.ease);
const animationOptions = { duration: ANIMATION_DURATION, easing };

export const useToastLayoutAnimations = () => {
  const { position } = useToastContext();
  const insets = useSafeAreaInsets();

  return React.useMemo(
    () => ({
      entering: () => {
        'worklet';
        return getToastEntering({ position, insets });
      },
      exiting: () => {
        'worklet';
        return getToastExiting({ position, insets });
      },
    }),
    [insets, position]
  );
};

type GetToastAnimationParams = {
  position: ToastPosition;
  insets: ReturnType<typeof useSafeAreaInsets>;
};

export const getToastEntering = ({
  position,
  insets,
}: GetToastAnimationParams) => {
  'worklet';

  const animations = {
    opacity: withTiming(1, animationOptions),
    transform: [
      { scale: withTiming(1, animationOptions) },
      {
        translateY: withTiming(
          position === ToastPosition.TOP_CENTER ? insets.top : -insets.bottom,
          animationOptions
        ),
      },
    ],
  };

  const initialValues = {
    opacity: 0,
    transform: [
      { scale: 0 },
      {
        translateY: position === ToastPosition.TOP_CENTER ? -50 : 50,
      },
    ],
  };

  return {
    initialValues,
    animations,
  };
};

export const getToastExiting = ({
  position,
  insets,
}: GetToastAnimationParams) => {
  'worklet';

  const animations = {
    opacity: withTiming(0, animationOptions),
    transform: [
      { scale: withTiming(0, animationOptions) },
      {
        translateY: withTiming(
          position === ToastPosition.TOP_CENTER ? 100 : -100,
          animationOptions
        ),
      },
    ],
  };

  const initialValues = {
    opacity: 1,
    transform: [
      { scale: 1 },
      {
        translateY:
          position === ToastPosition.TOP_CENTER ? insets.top : -insets.bottom,
      },
    ],
  };

  return {
    initialValues,
    animations,
  };
};
