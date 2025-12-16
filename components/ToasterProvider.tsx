'use client';

import { Toaster } from 'sonner';

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      theme="dark"
      toastOptions={{
        style: {
          background: '#1a1216',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
        },
      }}
    />
  );
}
