import { Button, Pressable, ScrollView, Text, View } from 'react-native';
import * as React from 'react';
import { toast } from 'react-native-reanimated-toasts';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ToastDemo: React.FC = () => {
  const [toastId, setToastId] = React.useState<string | null>(null);

  return (
    <SafeAreaView>
      <ScrollView>
        <Button
          title={toastId ? 'Update toast' : 'Show toast'}
          onPress={() => {
            if (toastId) {
              toast.success('Updated!', {
                id: toastId,
                onDismiss: () => {
                  setToastId(null);
                },
              });
            } else {
              const id = toast.success('Changes saved', {
                onDismiss: () => {
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
            toast.success('Changes saved', {
              description: 'Your changes have been saved successfully',
              closeButton: true,
            });
          }}
        />
        <Button
          title="Show toast with description and action"
          onPress={() => {
            toast.success('Changes saved', {
              action: {
                label: 'See changes',
                onPress: () => {
                  console.log('Action pressed');
                },
              },
              description:
                'Your changes have been saved successfully. This might go into a newline but we handle that by wrapping the text.',
            });
          }}
        />
        <Button
          title="Show outside of a React component"
          onPress={handleToast}
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
                success: (result: string) => `Promise resolved: ${result}`,
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
        <Button
          title="Dismiss active toast"
          disabled={!toastId}
          onPress={() => toast.dismiss(toastId!)}
        />
        <Button title="Dismiss all toasts" onPress={() => toast.dismiss()} />
        <Button
          title="Non-dismissible"
          onPress={() =>
            toast.success('Non-dismissible toast', { dismissible: false })
          }
        />
        <Button
          title="Infinity toast"
          onPress={() => {
            const id = toast.success('Infinity toast', {
              duration: Infinity,
              dismissible: false,
              action: {
                label: 'Acknowledge',
                onPress: () => {
                  toast.dismiss(id);
                  setToastId(null);
                },
              },
            });

            setToastId(id);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const handleToast = () => {
  toast.info('I am outside!');
};
