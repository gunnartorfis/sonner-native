import { Button } from '@react-navigation/elements';
import * as React from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { toast } from 'sonner-native';

export const ToastDemo: React.FC = () => {
  const [toastId, setToastId] = React.useState<string | number | null>(null);

  return (
    <View
      style={{
        marginTop: 16,
        gap: 16,
      }}
    >
      <Button disabled={!toastId} onPress={() => toast.dismiss(toastId!)}>
        Dismiss active toast
      </Button>
      <Button
        onPress={() => {
          toast.dismiss();
          setToastId(null);
        }}
      >
        Dismiss all toasts
      </Button>
      <Button
        onPress={() => {
          toast.success('center', { position: 'center' });
        }}
      >
        Center
      </Button>
      <Button
        onPress={() => {
          toast.success('exit animation bottom', {
            position: 'bottom-center',
            duration: 5000,
          });
        }}
      >
        exit animation bottom
      </Button>
      <Button
        onPress={() => {
          if (toastId) {
            toast.success('Updated!', {
              id: toastId,
              onDismiss: () => {
                setToastId(null);
              },
              onAutoClose: () => {
                setToastId(null);
              },
            });
          } else {
            const id = toast.success('Changes saved', {
              onDismiss: () => {
                setToastId(null);
              },
              onAutoClose: () => {
                setToastId(null);
              },
            });
            setToastId(id);
          }
        }}
      >
        {toastId ? 'Update toast' : 'Show toast'}
      </Button>
      <Button
        onPress={() => {
          toast.success('Changes saved', {
            description: 'Your changes have been saved successfully',
            closeButton: true,
          });
        }}
      >
        Show toast with description
      </Button>
      <Button
        onPress={() => {
          toast.warning('Rich colors', {
            description: 'Your changes have been saved successfully',
            richColors: true,
          });
        }}
      >
        Rich colors
      </Button>
      <Button
        onPress={() => {
          toast.success('Changes saved', {
            action: {
              label: 'See changes',
              onClick: () => {
                console.log('Action pressed');
              },
            },
            description:
              'Your changes have been saved successfully. This might go into a newline but we handle that by wrapping the text.',
          });
        }}
      >
        Show toast with description and action
      </Button>
      <Button
        onPress={() =>
          toast('Wiggle on update', {
            id: '123',
            description: new Date().toISOString(),
          })
        }
      >
        Wiggle on update
      </Button>
      <Button
        onPress={() => {
          if (toastId) {
            toast.wiggle(toastId);
          }
          toast.wiggle('123');
        }}
      >
        Wiggle toast
      </Button>
      <Button onPress={() => toast('Inverted toast', { invert: true })}>
        Invert toast
      </Button>
      <Button onPress={() => toast('Custom id', { id: '123' })}>
        Custom id
      </Button>
      <Button
        onPress={() => {
          toast('Custom icon', {
            icon: (
              <View>
                <Text>🚀</Text>
              </View>
            ),
          });
        }}
      >
        Custom icon
      </Button>
      <Button onPress={handleToast}>Show outside of a React component</Button>
      <Button
        onPress={() => {
          toast.promise(
            new Promise((resolve) => {
              setTimeout(() => {
                resolve('!');
              }, 2000);
            }),
            {
              loading: 'Loading...',
              success: (result: string) => `Success${result}`,
              error: 'Promise failed',
            }
          );
        }}
      >
        Toast with a successful promise
      </Button>
      <Button
        onPress={() => {
          toast.promise(
            new Promise((_, reject) => {
              setTimeout(() => {
                reject(new Error('promise failed'));
              }, 2000);
            }),
            {
              loading: 'Loading...',
              success: (result: string) => `Promise resolved: ${result}`,
              error: (error) =>
                error instanceof Error
                  ? `catch 'Error' ${error.message}`
                  : 'Promise failed',
            }
          );
        }}
      >
        Toast with a failed promise
      </Button>
      <Button
        onPress={() => {
          const id = toast('Blue screen of death', {
            action: {
              label: 'OK',
              onClick: () => {
                toast.dismiss(id);
              },
            },
            unstyled: true,
            icon: (
              <Image
                source={require('../assets/images/windows-xp.png')}
                style={{
                  width: 40,
                  height: 40,
                }}
              />
            ),
            actionButtonStyle: {
              borderStyle: 'dashed',
              borderColor: 'black',
              borderWidth: 2,
              borderRadius: 2,
              paddingVertical: 6,
              paddingHorizontal: 10,
              marginTop: 8,
              alignSelf: 'center',
            },
            actionButtonTextStyle: {
              fontSize: 14,
              color: 'black',
              textAlign: 'center',
            },
            styles: {
              toastContainer: {
                paddingHorizontal: 16,
                marginBottom: 16,
              },
              toast: {
                backgroundColor: '#ECE9D8',
                borderRadius: 3,
                padding: 15,
                borderColor: '#0055EA',
                borderWidth: 2,
              },
              toastContent: {
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
              },
              title: {
                fontSize: 14,
                fontWeight: 'light',
                fontFamily: 'sans-serif',
                color: 'black',
                marginBottom: 5,
                marginLeft: 4,
                textAlign: 'center',
              },
              description: {
                fontSize: 14,
                color: '#000000',
                marginBottom: 10,
              },
              closeButton: {
                backgroundColor: '#DD3C14',
                borderRadius: 2,
                alignSelf: 'flex-start',
              },
            },
          });
        }}
      >
        Windows XP with styles only
      </Button>
      <Button
        onPress={() =>
          toast('AirPods Pro', {
            description: 'Connected',
            icon: (
              <Image
                source={require('../assets/images/airpods.png')}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            ),
            unstyled: true,
            closeButton: false,
            dismissible: false,
            styles: {
              toastContainer: {
                alignItems: 'center',
              },
              toast: {
                shadowOpacity: 0.0015 * 4 + 0.1,
                shadowRadius: 3 * 4,
                shadowOffset: {
                  height: 4,
                  width: 0,
                },
                elevation: 4,
                backgroundColor: 'white',
                borderRadius: 999999,
                borderCurve: 'continuous',
              },
              toastContent: {
                padding: 12,
                paddingHorizontal: 32,
              },
              title: {
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 4,
              },
              description: {
                fontSize: 14,
                color: '#666',
                textAlign: 'center',
              },
            },
          })
        }
      >
        iOS like toast
      </Button>
      <Button
        onPress={() => {
          toast.custom(
            <View style={{ alignItems: 'center' }}>
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
                  onPress={() => {
                    console.log('pressed the modal');
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
              </View>
            </View>,
            {
              duration: 30000,
              position: 'bottom-center',
            }
          );
        }}
      >
        Custom JSX
      </Button>
      <Button
        onPress={() =>
          toast.success('Non-dismissible toast', { dismissible: false })
        }
      >
        Non-dismissible
      </Button>
      <Button
        onPress={() => {
          const id = toast.success('Infinity toast', {
            duration: Infinity,
            dismissible: false,
            id: 'infinity',
            action: {
              label: 'Acknowledge',
              onClick: () => {
                toast.dismiss(id);
                setToastId(null);
              },
            },
          });

          setToastId(id);
        }}
      >
        Infinity toast
      </Button>
      <Button
        onPress={() => {
          toast.error('Custom icon');
        }}
      >
        Custom icon in Toaster
      </Button>
      <Button
        onPress={() => {
          toast('My cancel toast', {
            cancel: {
              label: 'Cancel',
              onClick: () => console.log('Cancel!'),
            },
          });
        }}
      >
        Cancel
      </Button>
      <Button
        onPress={() => {
          toast('JSX action', {
            description: 'This toast has a JSX action',
            action: (
              <Button onPress={() => console.log('JSX action')}>
                Press me
              </Button>
            ),
          });
        }}
      >
        JSX action
      </Button>
      <Button onPress={() => toast.loading('Loading...')}>
        Loading variant
      </Button>
      <Button
        onPress={() => toast('Dynamic position', { position: 'bottom-center' })}
      >
        Dynamic position
      </Button>
      <Button onPress={() => toast.loading('Loading...')}>
        Loading icon override
      </Button>
      <Button
        onPress={() => toast('Dynamic position', { position: 'bottom-center' })}
      >
        Dynamic position
      </Button>
      <Button onPress={() => toast.warning('Warning')}>Warning toast</Button>
      <Button
        onPress={() => {
          const id = toast.success('OnPress action', {
            dismissible: false,
            onPress: () => {
              toast.dismiss(id);
              setToastId(null);
              Alert.alert('press');
            },
          });

          setToastId(id);
        }}
      >
        OnPress action
      </Button>

      <Button
        onPress={() => {
          const id = toast.success('Custom close button', {
            close: <Button onPress={() => toast.dismiss(id)}>close</Button>,
            closeButton: undefined,
          });
        }}
      >
        Custom close button
      </Button>
    </View>
  );
};

const handleToast = () => {
  toast.info('I am outside!');
};
