import type { TextStyle, ViewStyle } from 'react-native';
import { useColors } from './use-colors';

type DefaultStyles = {
  toast: ViewStyle;
  toastContent: ViewStyle;
  title: TextStyle;
  description: TextStyle;
  buttons: ViewStyle;
  actionButton: ViewStyle;
  actionButtonText: TextStyle;
  cancelButton: ViewStyle;
  cancelButtonText: TextStyle;
};

export const useDefaultStyles = ({
  invert,
  // richColors,
  unstyled,
  description,
}: {
  invert: boolean;
  // richColors: boolean;
  unstyled: boolean | undefined;
  description: string | undefined;
}): DefaultStyles => {
  const colors = useColors(invert);

  if (unstyled) {
    return {
      toast: {},
      toastContent: {},
      title: {},
      description: {},
      buttons: {},
      actionButton: {},
      actionButtonText: {},
      cancelButton: {},
      cancelButtonText: {},
    };
  }

  return {
    toast: {
      justifyContent: 'center',
      padding: 16,
      borderRadius: 16,
      marginHorizontal: 16,
      backgroundColor: colors['background-primary'],
      borderCurve: 'continuous',
    },
    toastContent: {
      flexDirection: 'row',
      gap: 16,
      alignItems: description?.length === 0 ? 'center' : undefined,
    },
    title: {
      fontWeight: '600',
      lineHeight: 20,
      color: colors['text-primary'],
    },
    description: {
      fontSize: 14,
      lineHeight: 20,
      marginTop: 2,
      color: colors['text-tertiary'],
    },
    buttons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginTop: 16,
    },
    actionButton: {
      flexGrow: 0,
      alignSelf: 'flex-start',
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors['border-secondary'],
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderCurve: 'continuous',
      backgroundColor: colors['background-secondary'],
    },
    actionButtonText: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600',
      alignSelf: 'flex-start',
      color: colors['text-primary'],
    },
    cancelButton: {
      flexGrow: 0,
    },
    cancelButtonText: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600',
      alignSelf: 'flex-start',
      color: colors['text-secondary'],
    },
  };
};
