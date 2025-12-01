import React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';
import type { ToasterProps } from './types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastContext } from './context';
import { getCloseButtonAreaWidth, isPressNearCloseButton } from './press-utils';

export const Positioner: React.FC<
  React.PropsWithChildren<Pick<ToasterProps, 'position' | 'style'>>
> = ({ children, position, style, ...props }) => {
  const { offset, isExpanded, collapse } = useToastContext();
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

  const handleOverlayPress = (event: {
    nativeEvent: { locationX: number };
  }) => {
    const pressX = event.nativeEvent.locationX;

    // Only collapse if not pressing near the close button
    if (!isPressNearCloseButton({ x: pressX })) {
      collapse();
    }
  };

  return (
    <>
      {/* Overlay for tap-outside-to-collapse when expanded */}
      {isExpanded && (
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: getCloseButtonAreaWidth(),
            backgroundColor: 'transparent',
          }}
          onPress={handleOverlayPress}
        />
      )}
      <View
        style={[getContainerStyle(), getInsetValues(), style]}
        pointerEvents="box-none"
        {...props}
      >
        {children}
      </View>
    </>
  );
};
