import { ToastDemo } from 'example/src/ToastDemo';
import { Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ToastDemoModal: React.FC<any> = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Button
        title="Back"
        onPress={() => {
          navigation.pop();
        }}
      />
      <ToastDemo />
    </SafeAreaView>
  );
};
