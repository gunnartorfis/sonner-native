import { Easing } from 'react-native-reanimated';

export const easeInOutCubic = Easing.bezier(0.645, 0.045, 0.355, 1);
export const easeOutCirc = Easing.bezier(0.075, 0.82, 0.165, 1);
export const easeInOutCircFn = Easing.bezierFn(0.785, 0.135, 0.15, 0.86);
