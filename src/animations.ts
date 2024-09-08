import React from 'react';
import { withTiming } from 'react-native-reanimated';
import { easeInOutCubic, easeOutCirc } from './easings';
import { useToastContext } from './context';
import type { ToastPosition } from './types';

export const ANIMATION_DURATION = 300;

export const useToastLayoutAnimations = (
  positionProp: ToastPosition | undefined
) => {
  const { position: positionCtx } = useToastContext();
  const position = positionProp || positionCtx;

  return React.useMemo(
    () => ({
      entering: () => {
        'worklet';
        return getToastEntering({ position });
      },
      exiting: () => {
        'worklet';
        return getToastExiting({ position });
      },
    }),
    [position]
  );
};

type GetToastAnimationParams = {
  position: ToastPosition;
};

export const getToastEntering = ({ position }: GetToastAnimationParams) => {
  'worklet';

  const animations = {
    opacity: withTiming(1, { easing: easeOutCirc }),
    transform: [
      { scale: withTiming(1, { easing: easeOutCirc }) },
      {
        translateY: withTiming(0, {
          easing: easeOutCirc,
        }),
      },
    ],
  };

  const initialValues = {
    opacity: 0,
    transform: [
      { scale: 0 },
      {
        translateY: position === 'top-center' ? -50 : 50,
      },
    ],
  };

  return {
    initialValues,
    animations,
  };
};

export const getToastExiting = ({ position }: GetToastAnimationParams) => {
  'worklet';

  const animations = {
    opacity: withTiming(0, { easing: easeInOutCubic }),
    transform: [
      {
        translateY: withTiming(position === 'top-center' ? -150 : 150, {
          easing: easeInOutCubic,
        }),
      },
    ],
  };

  const initialValues = {
    opacity: 1,
    transform: [
      {
        translateY: 0,
      },
    ],
  };

  return {
    initialValues,
    animations,
  };
};
