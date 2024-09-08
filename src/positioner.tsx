import React from 'react';
import { View } from 'react-native';
import type { ToasterProps } from './types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastContext } from './context';

export const Positioner: React.FC<
  React.PropsWithChildren<
    Pick<ToasterProps, 'position' | 'className' | 'style'>
  >
> = ({ children, position, className, style, ...props }) => {
  const { offset } = useToastContext();
  const { top, bottom } = useSafeAreaInsets();

  const insetValues = React.useMemo(() => {
    if (position === 'bottom-center') {
      if (offset) {
        return { bottom: offset };
      }

      if (bottom > 0) {
        return { bottom };
      }
      return { bottom: 40 };
    }

    if (position === 'top-center') {
      if (offset) {
        return { top: offset };
      }
      if (top > 0) {
        return { top };
      }
      return { top: 40 };
    }

    return {};
  }, [position, bottom, top, offset]);

  return (
    <View
      style={[
        {
          position: 'absolute',
          width: '100%',
          alignItems: 'center',
        },
        insetValues,
        style,
      ]}
      className={className}
      {...props}
    >
      {children}
    </View>
  );
};
