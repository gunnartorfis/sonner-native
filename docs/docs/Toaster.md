---
sidebar_position: 3
---

The Toaster is the context component which manages the addition, update, and removal of toast notifications and must be rendered within both the `SafeAreaProvider` and `GestureHandlerRootView`.

## Usage

To use the Toaster, place it at the root level of your app, after the NavigationContainer, to ensure it works across all screens. Here's an example setup:

```tsx
import { Toaster } from 'sonner-native';
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

## Customization

The Toaster component can provide default styles for all toasts, but individual toasts can also be customized. The Toaster component accepts a number of props to customize the appearance and behavior of the toasts.

### Position

The `position` prop determines where the toasts are displayed on the screen.

```tsx
// Available positions:
// top-center, bottom-center
<Toaster position="bottom-center" />
```

### Default styles for toasts

You can provide default styles for all toasts by passing `style` and `className` props to the Toaster component. All customization passed to the toast() will be concatenated with these default styles.

```tsx
<Toaster
  toastOptions={{
    style: { backgroundColor: 'red' },
    className: 'bg-red-500',
  }}
/>
```

### Usage with react-native-z-view

Use the `ToasterOverlayWrapper` prop to wrap the Toaster component with a custom component. This is useful when using `react-native-z-view` to render the toasts.

sonner-native uses `FullWindowOverlay` from react-native-screens by default on iOS and `View` on Android.

```tsx
import { ZView } from 'react-native-z-view';

<Toaster
  ToasterOverlayWrapper={ZView}
  toastOptions={{
    style: { backgroundColor: 'red' },
    className: 'bg-red-500',
  }}
/>;
```

## API Reference

| Property                 |                                            Description                                             |                     Default |
| :----------------------- | :------------------------------------------------------------------------------------------------: | --------------------------: |
| theme                    |                                          `light`, `dark`                                           |                     `light` |
| visibleToasts            |                                  Maximum number of visible toasts                                  |                         `3` |
| position                 |                              Place where the toasts will be rendered                               |                `top-center` |
| offset                   |                                   Offset from the top or bottom                                    |                         `0` |
| closeButton              |                                 Adds a close button to all toasts                                  |                     `false` |
| invert                   |                             Dark toasts in light mode and vice versa.                              |                     `false` |
| toastOptions             | These will act as default options for all toasts. See [toast()](/toast) for all available options. |                        `{}` |
| gap                      |                                  Gap between toasts when expanded                                  |                        `16` |
| icons                    |                                     Changes the default icons                                      |                         `-` |
| pauseWhenPageIsHidden    |                        Pauses toast timers when the app enters background.                         |                        `{}` |
| `swipToDismissDirection` |                             Swipe direction to dismiss (`left`, `up`).                             |                        `up` |
| cn                       |                         Custom function for constructing/merging classes.                          | `filter(Boolean).join(' ')` |
|  ToasterOverlayWrapper   |                                Custom component to wrap the Toaster.                               |                       `div` |
|  autoWiggleOnUpdate      |             Adds a wiggle animation on toast update. `never`, `toast-change`, `always`             |                     `never` |
