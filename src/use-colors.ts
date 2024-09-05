import { useColorScheme } from 'react-native';

const light = {
  'background-primary': '#fff',
  'background-secondary': '#f7f7f7',
  'text-primary': '#232020',
  'text-secondary': '#3f3b3b',
  'text-tertiary': '#4f4a4a',
  'border-secondary': '#e6e3e3',
  'success': '#3c8643',
  'error': '#ff3a41',
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
  'info': '#B3CDFF',
};

export const useColors = () => {
  const scheme = useColorScheme();

  console.log(scheme);

  if (scheme === 'dark') {
    return dark;
  }

  return light;
};
