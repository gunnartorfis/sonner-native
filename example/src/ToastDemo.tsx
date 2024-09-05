import { Button, Pressable, Text, View } from 'react-native';
import * as React from 'react';
import { toast } from 'react-native-reanimated-toasts';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ToastDemo: React.FC = () => {
  const [variant, setVariant] = React.useState<'success' | 'error' | 'info'>(
    'info'
  );
  const [toastId, setToastId] = React.useState<string | null>(null);

  return (
    <SafeAreaView>
      <Text>Selected variant: {variant}</Text>
      <View className="flex flex-row items-center justify-between mb-12">
        <Button title="Success" onPress={() => setVariant('success')} />
        <Button title="Info" onPress={() => setVariant('info')} />
        <Button title="Error" onPress={() => setVariant('error')} />
      </View>
      <Button
        title={toastId ? 'Update toast' : 'Show toast'}
        onPress={() => {
          if (toastId) {
            toast('Updated!', {
              id: toastId,
              onHide: () => {
                setToastId(null);
              },
            });
          } else {
            const id = toast('Changes saved', {
              variant,
              onHide: () => {
                setToastId(null);
              },
            });
            setToastId(id);
          }
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
            description:
              'Your changes have been saved successfully. This might go into a newline but we handle that by wrapping the text.',
            variant,
          });
        }}
      />
      <Button title="Show outside of a React component" onPress={handleToast} />
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
      <Button
        title="Custom JSX"
        onPress={() => {
          toast.custom(
            <View
              style={{
                width: '80%',
                backgroundColor: '#26252A',
                paddingLeft: 24,
                paddingRight: 8,
                paddingVertical: 8,
                borderRadius: 999,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderCurve: 'continuous',
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '600',
                }}
              >
                Custom JSX
              </Text>
              <Pressable
                style={{
                  backgroundColor: '#40424B',
                  borderWidth: 1,
                  borderColor: '#55555C',
                  borderRadius: 999,
                  padding: 8,
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: '600',
                  }}
                >
                  Press me
                </Text>
              </Pressable>
            </View>,
            {
              duration: 30000,
            }
          );
        }}
      />
    </SafeAreaView>
  );
};

const handleToast = () => {
  toast('I am outside!', {
    variant: 'success',
  });
};
