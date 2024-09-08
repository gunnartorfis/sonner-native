import { useColorScheme } from 'react-native';
import { useToastContext } from './context';

const light = {
  'background-primary': '#fff',
  'background-secondary': '#f7f7f7',
  'text-primary': '#232020',
  'text-secondary': '#3f3b3b',
  'text-tertiary': '#4f4a4a',
  'border-secondary': '#e6e3e3',
  'success': '#3c8643',
  'error': '#ff3a41',
  'warning': '#e37a00',
  'info': '#286efa',
};

const dark: typeof light = {
  'background-primary': '#181313',
  'background-secondary': '#232020',
  'text-primary': '#fff',
  'text-secondary': '#E6E3E3',
  'text-tertiary': '#C0BEBE',
  'border-secondary': '#302B2B',
  'success': '#9ED397',
  'error': '#FF999D',
  'warning': '#ffd089',
  'info': '#B3CDFF',
};

export const useColors = () => {
  const { invert } = useToastContext();
  const scheme = useColorScheme();

  if (scheme === 'dark') {
    if (invert) return light;
    return dark;
  }

  if (invert) return dark;
  return light;
};
