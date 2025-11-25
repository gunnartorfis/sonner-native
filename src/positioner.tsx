import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastContext } from './context';
import {
  getContainerStyle,
  getInsetValues,
  calculateOutsidePressableArea,
} from './positioner-utils';
import type { ToasterProps } from './types';

export const Positioner: React.FC<
  React.PropsWithChildren<Pick<ToasterProps, 'position' | 'style'>>
> = ({ children, position, style, ...props }) => {
  const { offset, isExpanded, collapse, toastHeights, gap, visibleToasts } =
    useToastContext();
  const { top, bottom } = useSafeAreaInsets();

  const resolvedPosition = position || 'bottom-center';
  const containerStyle = getContainerStyle(resolvedPosition);

  const insetValues = getInsetValues({
    position: resolvedPosition,
    offset,
    safeAreaInsets: { top, bottom },
  });

  const handleOutsidePress = () => {
    if (isExpanded) {
      collapse();
    }
  };

  const outsidePressableStyle = calculateOutsidePressableArea({
    position: resolvedPosition,
    toastHeights,
    gap,
    visibleToasts: visibleToasts || 3,
    insetValues,
  });

  const finalContainerStyle = [containerStyle, insetValues, style];

  // Don't show expand/collapse for center position
  const shouldAllowCollapse = resolvedPosition !== 'center' && isExpanded;

  return (
    <>
      {/* Outside pressable area - positioned outside the toast stack */}
      {shouldAllowCollapse && (
        <Pressable style={outsidePressableStyle} onPress={handleOutsidePress} />
      )}
      {/* Toast container */}
      <View style={finalContainerStyle} pointerEvents="box-none" {...props}>
        {children}
      </View>
    </>
  );
};
