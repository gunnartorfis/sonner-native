import * as React from 'react';
import { Text, View, Switch, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import '../global.css';
import Navigator from './navigation';
// import { ToastWrapper } from './ToastWrapper';

const App: React.FC = () => {
  const [stackingEnabled, setStackingEnabled] = React.useState(true);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <Navigator />
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>
            Stacking: {stackingEnabled ? 'ON' : 'OFF'}
          </Text>
          <Switch value={stackingEnabled} onValueChange={setStackingEnabled} />
        </View>
        <Toaster
          position="top-center"
          // offset={100}
          duration={30000}
          swipeToDismissDirection="up"
          visibleToasts={4}
          closeButton
          autoWiggleOnUpdate="toast-change"
          theme="system"
          enableStacking={stackingEnabled}
          icons={{
            error: <Text>💥</Text>,
            loading: <Text>🔄</Text>,
          }}
          toastOptions={{
            actionButtonStyle: {
              paddingHorizontal: 20,
            },
          }}
          // ToastWrapper={ToastWrapper}
          pauseWhenPageIsHidden
        />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 1000,
  },
  toggleLabel: {
    color: 'white',
    marginRight: 8,
    fontSize: 12,
  },
});

export default App;
