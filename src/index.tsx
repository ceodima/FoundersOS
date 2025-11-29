// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Попытка импорта SDKProvider (новое имя)
let SDKProvider: any;
try {
  // @ts-ignore — для dev без строгой типизации
  const sdkModule = require('@tma.js/sdk-react');
  SDKProvider = sdkModule.SDKProvider || sdkModule.BrowserProvider; // fallback на старое имя
} catch (e) {
  console.warn('TMA SDK not available in dev mode:', e);
  SDKProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>; // заглушка для dev
}

import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SDKProvider acceptCustomStyles debug>
      <App />
    </SDKProvider>
  </React.StrictMode>
);