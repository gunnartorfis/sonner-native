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

  'rich': {
    success: {
      background: '#ecfdf3',
      foreground: '#008a2e',
      border: '#d3fde5',
    },
    error: {
      background: '#fff0f0',
      foreground: '#e60000',
      border: '#ffe0e1',
    },
    warning: {
      background: '#fffcf0',
      foreground: '#dc7609',
      border: '#fdf5d3',
    },
    info: {
      background: '#f0f8ff',
      foreground: '#0973dc',
      border: '#d3e0fd',
    },
  },
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

  'rich': {
    success: {
      background: '#001f0f',
      foreground: '#59f3a6',
      border: '#003d1c',
    },
    error: {
      background: '#2d0607',
      foreground: '#ff9ea1',
      border: '#4d0408',
    },
    warning: {
      background: '#1d1f00',
      foreground: '#f3cf58',
      border: '#3d3d00',
    },
    info: {
      background: '#000d1f',
      foreground: '#5896f3',
      border: '#00113d',
    },
  },
};

export const useColors = (invertProps?: boolean) => {
  const { invert: invertCtx, theme } = useToastContext();
  const systemScheme = useColorScheme();
  const scheme = theme === 'system' ? systemScheme : theme;
  const invert = invertProps ?? invertCtx;

  if (scheme === 'dark') {
    if (invert) return light;
    return dark;
  }

  if (invert) return dark;
  return light;
};
