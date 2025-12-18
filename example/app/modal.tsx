import { Platform, ScrollView } from 'react-native';
import { ToastDemo } from '../components/toasts-demo';

export default function Index() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingTop: Platform.OS === 'ios' ? 0 : 20,
        paddingHorizontal: 20,
      }}
    >
      <ToastDemo />
    </ScrollView>
  );
}
