import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { toast, Toaster } from 'sonner-native';
import '../global.css';
import Navigator from './navigation';

const ToastWrapper: React.ComponentType<
  React.ComponentProps<typeof View> & {
    children: React.ReactNode;
    toastId: string | number;
  }
> = ({ toastId, style, ...props }) => {
  return (
    <Pressable
      style={[style, { backgroundColor: 'red' }]}
      onPress={() => toast.dismiss(toastId)}
      {...props}
    />
  );
};

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <Navigator />
        <Toaster
          position="top-center"
          // offset={100}
          duration={3000}
          swipeToDismissDirection="up"
          visibleToasts={4}
          closeButton
          autoWiggleOnUpdate="toast-change"
          theme="system"
          icons={{
            error: <Text>💥</Text>,
            loading: <Text>🔄</Text>,
          }}
          toastOptions={{
            actionButtonStyle: {
              paddingHorizontal: 20,
            },
          }}
          ToastWrapper={ToastWrapper}
          pauseWhenPageIsHidden
        />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
