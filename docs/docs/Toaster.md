---
sidebar_position: 3
---

The Toaster is the context component which manages the addition, update, and removal of toast notifications and must be rendered within both the `SafeAreaProvider` and `GestureHandlerRootView`.

## Usage

To use the Toaster, place it at the root level of your app, after the NavigationContainer, to ensure it works across all screens. Here's an example setup:

```tsx
import { Toaster } from 'react-native-reanimated-toasts';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <NavigationContainer>{/* App content */}</NavigationContainer>
        <Toaster />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
```

## Props

| Prop                     | Type                  | Default      | Description                                                 |
| ------------------------ | --------------------- | ------------ | ----------------------------------------------------------- |
| `duration`               | `number`              | `3000` (ms)  | Duration each toast is visible before auto-dismissal.       |
| `position`               | `ToastPosition`       | `top-center` | The position of the toasts (`top-center`, `bottom-center`). |
| `visibleToasts`          | `number`              | `3`          | Maximum number of toasts to show at once.                   |
| `swipToDismissDirection` | `ToastSwipeDirection` | `up`         | Swipe direction to dismiss (`left`, `up`).                  |

### Style related props

| Prop                      | Type        | Default     | Description                                                    |
| ------------------------- | ----------- | ----------- | -------------------------------------------------------------- |
| `rootStyle`               | `ViewStyle` | `undefined` | Style for the root container.                                  |
| `rootClassName`           | `string`    | `undefined` | `NativeWind` class names for root container styling.           |
| `toastContainerStyle`     | `ViewStyle` | `undefined` | Style for the toast container (wrapper for individual toasts). |
| `toastContainerClassName` | `string`    | `undefined` | `NativeWind` class names for the toast container.              |
| `toastContentStyle`       | `ViewStyle` | `undefined` | Style for individual toast content.                            |
| `toastContentClassName`   | `string`    | `undefined` | `NativeWind` class names for individual toast content.         |
| `actionClassName`         | `string`    | `undefined` | `NativeWind` class names for the toast action button.          |
| `actionLabelClassName`    | `string`    | `undefined` | `NativeWind` class names for the toast action label.           |
| `descriptionClassName`    | `string`    | `undefined` | `NativeWind` class names for the toast description.            |
| `titleClassName`          | `string`    | `undefined` | `NativeWind` class names for the toast title.                  |
| `actionStyle`             | `ViewStyle` | `undefined` | Style for the toast action button.                             |
| `actionLabelStyle`        | `TextStyle` | `undefined` | Style for the toast action label.                              |
| `descriptionStyle`        | `TextStyle` | `undefined` | Style for the toast description.                               |
| `titleStyle`              | `TextStyle` | `undefined` | Style for the toast title.                                     |
| `closeIconColor`          | `string`    | `undefined` | Color for the toast's close icon.                              |
