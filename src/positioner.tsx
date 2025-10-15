import React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';
import type { ToasterProps } from './types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastContext } from './context';

export const Positioner: React.FC<
  React.PropsWithChildren<Pick<ToasterProps, 'position' | 'style'>>
> = ({ children, position, style, ...props }) => {
  const { offset, isExpanded, collapse, toastHeights, gap, visibleToasts } =
    useToastContext();
  const { top, bottom } = useSafeAreaInsets();

  const getContainerStyle = (): ViewStyle => {
    if (position === 'center') {
      return {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible',
      };
    }

    return {
      position: 'absolute',
      width: '100%',
      alignItems: 'center',
      overflow: 'visible',
    };
  };

  const getInsetValues = () => {
    const spacingForSafeArea = 20;
    if (position === 'bottom-center') {
      const safeAreaSpacing = offset || bottom || 0;
      return {
        bottom:
          safeAreaSpacing === 0 ? 40 : safeAreaSpacing + spacingForSafeArea,
      };
    }

    if (position === 'top-center') {
      const safeAreaSpacing = offset || top || 0;
      return {
        top: safeAreaSpacing === 0 ? 40 : safeAreaSpacing + spacingForSafeArea,
      };
    }

    return {};
  };

  const handleOutsidePress = () => {
    if (isExpanded) {
      collapse();
    }
  };

  const getOutsidePressableStyle = (): ViewStyle => {
    // Calculate the approximate height of the toast stack
    const ESTIMATED_TOAST_HEIGHT = 70; // Fallback height
    const toastHeightValues = Object.values(toastHeights);
    const numberOfToastsTocalculate = Math.min(
      toastHeightValues.length,
      visibleToasts || 3
    );

    // Calculate total height: use actual heights if available, otherwise estimate
    const totalToastHeight =
      toastHeightValues.length > 0
        ? toastHeightValues
            .slice(0, numberOfToastsTocalculate)
            .reduce((sum, height) => sum + height, 0)
        : ESTIMATED_TOAST_HEIGHT * numberOfToastsTocalculate;

    const gapHeight = (gap || 14) * Math.max(0, numberOfToastsTocalculate - 1);
    const stackHeight = totalToastHeight + gapHeight + 20; // Add some padding

    // Position the pressable area outside the toast stack
    if (position === 'top-center') {
      // For top position, pressable area is below the toast stack
      const topOffset = (getInsetValues().top || 40) + stackHeight;
      return {
        position: 'absolute',
        top: topOffset,
        bottom: 0,
        left: 0,
        right: 0,
      };
    }

    if (position === 'bottom-center') {
      // For bottom position, pressable area is above the toast stack
      const bottomOffset = (getInsetValues().bottom || 40) + stackHeight;
      return {
        position: 'absolute',
        top: 0,
        bottom: bottomOffset,
        left: 0,
        right: 0,
      };
    }

    // No outside press for center position
    return { display: 'none' };
  };

  const containerStyle = [getContainerStyle(), getInsetValues(), style];

  // Don't show expand/collapse for center position
  const shouldAllowCollapse = position !== 'center' && isExpanded;

  return (
    <>
      {/* Outside pressable area - positioned outside the toast stack */}
      {shouldAllowCollapse && (
        <Pressable
          style={getOutsidePressableStyle()}
          onPress={handleOutsidePress}
        />
      )}
      {/* Toast container */}
      <View style={containerStyle} pointerEvents="box-none" {...props}>
        {children}
      </View>
    </>
  );
};
