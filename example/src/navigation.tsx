import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ToastDemo } from './ToastDemo';

function HomeScreen({
  navigation,
}: NativeStackScreenProps<HomeStackParamList, 'Home'>) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Button
        title="Show modal"
        onPress={() => {
          navigation.getParent()?.navigate('Modal');
        }}
      />
      <ToastDemo />
    </SafeAreaView>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings screen</Text>
    </View>
  );
}

type HomeStackParamList = {
  Home: undefined;
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

type SettingsStackParamList = {
  Settings: undefined;
};

const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
}

type RootStackParamList = {
  Tab: undefined;
  Modal: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const Tab = createBottomTabNavigator();

const MainTab: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeStack" component={HomeStackScreen} />
      <Tab.Screen name="SettingsStack" component={SettingsStackScreen} />
    </Tab.Navigator>
  );
};

const ToastDemoModal: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ToastDemo />
    </SafeAreaView>
  );
};

export default function Navigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Tab"
          component={MainTab}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="Modal"
          component={ToastDemoModal}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
