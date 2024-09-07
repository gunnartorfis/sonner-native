import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ToastDemoModal } from 'example/src/ToastDemoModal';
import { ToastDemoScreen } from 'example/src/ToastDemoScreen';
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'react-native-reanimated-toasts';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';
import { Text } from 'react-native';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{}}>
            <Stack.Screen name="ToastDemo" component={ToastDemoScreen} />
            <Stack.Screen
              name="ToastDemoModal"
              component={ToastDemoModal}
              options={{
                presentation: 'modal',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <Toaster
          position="top-center"
          duration={30000}
          swipToDismissDirection="up"
          visibleToasts={4}
          closeButton
          icons={{
            error: <Text>💥</Text>,
          }}
          toastOptions={{}}
        />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
