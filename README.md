# react-native-reanimated-toasts

Animated, customizable Toasts for React Native

![preview](https://github.com/user-attachments/assets/b0a95d89-3895-4d95-8a87-262fb7209805)


## Installation

```sh
npm install react-native-reanimated-toasts
```

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

For more advanced usage, check out the [documentation](https://xx.com)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
