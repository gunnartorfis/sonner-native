import { useDerivedValue, withTiming } from 'react-native-reanimated';
import { ANIMATION_DURATION } from './animations';
import { toastDefaultValues } from './constants';
import { easeOutQuartFn } from './easings';
import type { ToastPosition } from './types';

// Default estimated height for toasts before measurement
const ESTIMATED_TOAST_HEIGHT = 70;

export const useToastPosition = ({
  id,
  index,
  numberOfToasts,
  enableStacking,
  position,
  allToastHeights,
  gap,
  orderedToastIds,
}: {
  id: string | number;
  index: number;
  numberOfToasts: number;
  enableStacking: boolean;
  position: ToastPosition;
  allToastHeights: Record<string | number, number>;
  gap: number;
  orderedToastIds: Array<string | number>;
}) => {
  const yPosition = useDerivedValue(() => {
    'worklet';

    const calculatePosition = () => {
      if (position === 'center') {
        // Center position: stack from center outward
        if (enableStacking) {
          const stackGap = toastDefaultValues.stackGap;
          const offsetFromCenter = stackGap * (numberOfToasts - index - 1);
          return offsetFromCenter;
        } else {
          // Non-stacking center: calculate based on heights
          let totalOffset = 0;
          for (let i = 0; i < index; i++) {
            const toastId = orderedToastIds[i];
            if (!toastId) {
              continue;
            }
            const height = allToastHeights[toastId] || ESTIMATED_TOAST_HEIGHT;
            totalOffset += height + gap;
          }
          return totalOffset;
        }
      }

      if (enableStacking) {
        // Stacking mode: overlap with small offset
        const stackGap = toastDefaultValues.stackGap;

        if (position === 'bottom-center') {
          // Bottom: newest toast (highest index) is at 0
          // Older toasts (lower indices) are offset up (negative Y)
          const multiplier = numberOfToasts - index - 1;
          return -stackGap * multiplier;
        } else {
          // Top: newest toast (index 0) is at 0
          // Older toasts (higher indices) are offset down (positive Y)
          const multiplier = index;
          return stackGap * multiplier;
        }
      } else {
        // Non-stacking mode: fully separated by gap
        if (position === 'bottom-center') {
          // Bottom: newest at 0, sum heights going up (negative)
          let totalOffset = 0;
          for (let i = numberOfToasts - 1; i > index; i--) {
            const toastId = orderedToastIds[i];
            if (!toastId) {
              continue;
            }
            const height = allToastHeights[toastId] || ESTIMATED_TOAST_HEIGHT;
            totalOffset += height + gap;
          }
          return -totalOffset;
        } else {
          // Top: oldest at 0, sum heights going down (positive)
          let totalOffset = 0;
          for (let i = 0; i < index; i++) {
            const toastId = orderedToastIds[i];
            if (!toastId) {
              continue;
            }
            const height = allToastHeights[toastId] || ESTIMATED_TOAST_HEIGHT;
            totalOffset += height + gap;
          }
          return totalOffset;
        }
      }
    };

    return withTiming(calculatePosition(), {
      duration: ANIMATION_DURATION,
      easing: easeOutQuartFn,
    });
  }, [
    id,
    index,
    numberOfToasts,
    enableStacking,
    position,
    allToastHeights,
    gap,
    orderedToastIds,
  ]);

  return yPosition;
};
