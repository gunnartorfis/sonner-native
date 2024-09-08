import * as React from 'react';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import '../global.css';
import Navigator from './navigation';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <Navigator />
        <Toaster
          position="bottom-center"
          // offset={100}
          duration={30000}
          swipToDismissDirection="up"
          visibleToasts={4}
          closeButton
          icons={{
            error: <Text>💥</Text>,
          }}
          offset={200}
          toastOptions={{}}
        />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
