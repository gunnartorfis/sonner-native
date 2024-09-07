# react-native-reanimated-toasts

Animated, customizable Toasts for React Native

![preview](https://github.com/user-attachments/assets/b0a95d89-3895-4d95-8a87-262fb7209805)

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

## Showcase

<img width="416" alt="Screenshot 2024-09-06 at 16 33 10" src="https://github.com/user-attachments/assets/fb986f0f-6f5a-4716-9633-6dfe492a9e9c">
<img width="388" alt="Screenshot 2024-09-06 at 16 32 27" src="https://github.com/user-attachments/assets/8fa438c4-3c65-4f8f-ad15-52cc24e1faf5">
<img width="392" alt="Screenshot 2024-09-06 at 16 32 33" src="https://github.com/user-attachments/assets/fe43bc29-5d25-4e32-a88c-bba6e58a6eda">
<img width="388" alt="Screenshot 2024-09-06 at 16 32 39" src="https://github.com/user-attachments/assets/ead85100-b52e-433a-b8b8-9416cfb79b63">
<img width="406" alt="Screenshot 2024-09-06 at 16 33 04" src="https://github.com/user-attachments/assets/bbc20957-160f-43c1-b317-b64512ec7cef">

## Expo Snack

https://snack.expo.dev/@gunnartorfis/react-native-reanimated-toasts

## Installation

```sh
npm install react-native-reanimated-toasts
```

#### Requirements

To use this package, **you also need to install its peer dependencies**. Check out their documentation for more information:

- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/)
- [React Native Safe Area Context](https://docs.expo.dev/versions/latest/sdk/safe-area-context/)
- [React Native SVG](https://github.com/software-mansion/react-native-svg)

## Usage

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

## Documentation

For more advanced usage, check out the [documentation](https://gunnartorfis.github.io/react-native-reanimated-toasts/)

## Recording

https://github.com/user-attachments/assets/ccc428ca-37c3-4589-9e8c-f414c40d764c

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)