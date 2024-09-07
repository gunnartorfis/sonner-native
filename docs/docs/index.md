---
sidebar_position: 1
---

# Introduction

**react-native-reanimated-toasts** is a highly customizable and performant toast library for React Native, built with Reanimated 3. It provides a simple API to display toast notifications with various options and configurations.

![Preview](/img/preview.png)

## Features

- API fully matches [Sonner's](https://sonner.emilkowal.ski/)
- Multiple variants, including `success`, `error`, `warning`, `custom`, `promise`
- Promise variant with built-in loading state
- Custom JSX with the custom variant
- Top or bottom positions
- Title and description
- Action button with a callback
- Custom icons
- Optionally dismissable with swipe, configurable left or up
- Dismissable with toast.dismiss(), one or all toasts
- Highly performant using Reanimated 3, 60 FPS
- Dark mode built-in
- Works with Expo
- NativeWind supported
- Customizable, styles & className props
- Works outside of React components

## Installation

```bash npm2yarn
yarn add react-native-reanimated-toasts
```

#### Requirements

To use this package, **you also need to install its peer dependencies**. Check out their documentation for more information:

- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/)
- [React Native Safe Area Context](https://docs.expo.dev/versions/latest/sdk/safe-area-context/)
- [React Native SVG](https://github.com/software-mansion/react-native-svg)

## Getting started

### In your App.tsx/entry point

```typescript
import { Toaster } from 'react-native-reanimated-toasts';

function App() {
  return (
    <View>
      <NavigationContainer>...</NavigationContainer>
      <Toaster />
    </View>
  );
}
```

### Show a toast

```typescript
import { toast } from 'react-native-reanimated-toasts';

function SomeComponent() {
  return (
    <Button
      title="Show Toast"
      onPress={() => toast('Hello, World!')}
    />
  );
}
```

## Examples

An example can be found in the [`example`](https://github.com/gunnartorfis/react-native-reanimated-toasts/tree/main/example) folder.
