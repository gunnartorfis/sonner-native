import { ToastDemo } from 'example/src/ToastDemo';
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  ToastPosition,
  ToastProvider,
  ToastSwipeDirection,
  ToastVariant,
} from 'react-native-reanimated-toasts';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import '../global.css';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="ToastDemo" component={ToastDemo} />
          </Stack.Navigator>
        </NavigationContainer>
        <ToastProvider
          position={ToastPosition.TOP_CENTER}
          duration={30000}
          swipToDismissDirection={ToastSwipeDirection.UP}
          actionClassName="bg-slate-600 border-slate-500"
          actionLabelClassName="text-foreground-inverse"
          closeIconColor="#00c1d8"
          descriptionClassName="text-foreground-inverse-secondary"
          getIconColorForVariant={(variant) => {
            switch (variant) {
              case ToastVariant.SUCCESS:
                return '#00c1d8';
              case ToastVariant.ERROR:
                return '#ff4d4f';
              case ToastVariant.INFO:
              default:
                return '#c4c4c4';
            }
          }}
          rootClassName=""
          titleClassName="text-gray-100"
          toastContainerClassName=""
          toastContentClassName="bg-slate-600"
        />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
