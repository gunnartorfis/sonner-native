import * as React from 'react';
import { type ToasterContextType } from './types';

export const ToastContext = React.createContext<ToasterContextType | null>(
  null
);

export const useToastContext = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
