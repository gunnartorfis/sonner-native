import { Button, Text, View } from 'react-native';
import * as React from 'react';
import { toast, ToastVariant } from 'react-native-reanimated-toasts';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ToastDemo: React.FC = () => {
  const [variant, setVariant] = React.useState<ToastVariant>(ToastVariant.INFO);
  return (
    <SafeAreaView className="gap-4 px-4 mb-16">
      <Text>Selected variant: {variant}</Text>
      <View className="flex flex-row items-center gap-4">
        <Button
          title="Success"
          onPress={() => setVariant(ToastVariant.SUCCESS)}
        />
        <Button title="Info" onPress={() => setVariant(ToastVariant.INFO)} />
        <Button title="Error" onPress={() => setVariant(ToastVariant.ERROR)} />
      </View>
      <Button
        title="Show toast"
        onPress={() => {
          toast('Changes saved', {
            variant,
          });
        }}
      />
      <Button
        title="Show toast with description"
        onPress={() => {
          toast('Changes saved', {
            description: 'Your changes have been saved successfully',
            variant,
          });
        }}
      />
      <Button
        title="Show toast with description and action"
        onPress={() => {
          toast('Changes saved', {
            action: {
              label: 'See changes',
              onPress: () => {
                console.log('Action pressed');
              },
            },
            description: 'Your changes have been saved successfully',
            variant,
          });
        }}
      />
      <Button
        title="Toast with a promise"
        onPress={() => {
          toast.promise(
            new Promise((resolve) => {
              setTimeout(() => {
                resolve('Promise resolved');
              }, 7000);
            }),
            {
              loading: 'Loading...',
              success: (result) => `Promise resolved: ${result}`,
              error: 'Promise failed',
            }
          );
        }}
      />
    </SafeAreaView>
  );
};
