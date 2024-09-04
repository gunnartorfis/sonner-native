import { type ToastContextType } from '@/types/toastTypes';
import * as React from 'react';

export const ToastContext = React.createContext<ToastContextType | null>(null);

export const useToastContext = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
