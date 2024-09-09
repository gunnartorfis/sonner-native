import Svg, { type SvgProps, Circle, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  size?: number;
}

export const CircleCheck = ({ size, ...props }: IconProps) => (
  <Svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    {...props}
  >
    <Circle cx={12} cy={12} r={10} />
    <Path d="m9 12 2 2 4-4" />
  </Svg>
);

export const CircleX = ({ size, ...props }: IconProps) => (
  <Svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    {...props}
  >
    <Circle cx={12} cy={12} r={10} />
    <Path d="m15 9-6 6M9 9l6 6" />
  </Svg>
);

export const Info = ({ size, ...props }: IconProps) => (
  <Svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    {...props}
  >
    <Circle cx={12} cy={12} r={10} />
    <Path d="M12 16v-4M12 8h.01" />
  </Svg>
);

export const TriangleAlert = ({ size, ...props }: IconProps) => (
  <Svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    {...props}
  >
    <Path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4M12 17h.01" />
  </Svg>
);

export const X = ({ size, ...props }: IconProps) => (
  <Svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    {...props}
  >
    <Path d="M18 6 6 18M6 6l12 12" />
  </Svg>
);
