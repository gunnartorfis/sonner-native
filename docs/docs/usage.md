# Showing a toast

## Basic toast

To display a simple toast message, use the toast() function. You can pass a title and optional settings.

```jsx
import { toast } from 'react-native-reanimated-toasts';

toast('This is a basic toast message.');
```

Alternatively, you can pass an object as the second argument with additional options, which will override any options provided to the Toaster component if specified.

```jsx
import { toast } from 'react-native-reanimated-toasts';

toast.success('Operation successful!', {
  description: 'Everything worked as expected.',
  duration: 3000, // duration in milliseconds
});
```

## Variations

### Success Toast

The toast.success() function allows you to display a success message. By default, it renders a checkmark icon in front of the message.

```jsx
toast.success('My success toast');
```

### Error

Use the toast.error() function to display an error message. By default, it renders a X icon in front of the message.

```jsx
toast.error('My error toast');
```

### Action

Renders a primary button, clicking it will close the toast and run the callback passed via `onClick`. You can prevent the toast from closing by calling `event.preventDefault()` in the `onClick` callback.

```jsx
toast('My action toast', {
  action: {
    label: 'Action',
    onClick: () => console.log('Action!'),
  },
});
```

### Promises

The toast.promise function can be used to display a toast message while a promise is in progress, and update the message based on the promise's success or failure.

```jsx
const fetchData = async () => {
  try {
    const data = await fetch('/api/data');
    return data;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
};

const toastId = toast.promise(fetchData(), {
  loading: 'Loading data...',
  success: (data) => `Data loaded: ${data}`,
  error: 'Error fetching data',
});
```

In this example, the toast.promise function will display a "Loading data..." message while the fetchData promise is in progress, and update the message to the success or error text based on the promise's outcome.

## Other

### Updating existing toasts

You can update an existing toast by using the updateToast function, which takes the toast's unique identifier and the new toast options:

```jsx
const toastId = toast('Hello');

updateToast(toastId, {
  description: 'Updated error message',
  duration: 5000,
});
```
