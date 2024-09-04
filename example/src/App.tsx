import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ToastDemoModal } from 'example/src/ToastDemoModal';
import { ToastDemoScreen } from 'example/src/ToastDemoScreen';
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  ToastPosition,
  Toaster,
  ToastSwipeDirection,
} from 'react-native-reanimated-toasts';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <NavigationContainer>
          <Stack.Navigator>
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
          position={ToastPosition.TOP_CENTER}
          duration={3000}
          swipToDismissDirection={ToastSwipeDirection.UP}
          maxToasts={4}
        />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
