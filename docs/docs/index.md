---
sidebar_position: 1
---

# Introduction

**An incredibly fast and flexible way of building calendars in React Native.**

![Preview](/img/preview.png)

## Features

- Multiple variants, including `success`, `error`, `warning`
- Promise option with built in loading state
- Top or bottom positions
- Title and description
- Action button with callback
- Custom icons
- Dismissable with swipe, configurable left or up
- Highly performant using Reanimated 3
- Dark mode support
- Works with Expo
- NativeWind support
- Customizable

## Installation

```bash npm2yarn
yarn add react-native-reanimated-toasts
```

#### Requirements

To use this package, **you also need to install its peer dependencies**. Check out their documentation for more information:

- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/)
- [React Native Safe Area Context](https://docs.expo.dev/versions/latest/sdk/safe-area-context/)

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

Check out the [Showing a toast](usage) section to see more details on how to use the package.

## Examples

An example can be found in the [`example`](https://github.com/gunnartorfis/react-native-reanimated-toasts/tree/main/example) workspace.
