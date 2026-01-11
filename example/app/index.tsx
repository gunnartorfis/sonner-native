import { Text } from '@react-navigation/elements';
import { Link } from 'expo-router';
import { ScrollView } from 'react-native';
import { ToastDemo } from '../components/toasts-demo';

export default function Index() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <Link href="/modal">
        <Text>Show modal</Text>
      </Link>
      <ToastDemo />
    </ScrollView>
  );
}
