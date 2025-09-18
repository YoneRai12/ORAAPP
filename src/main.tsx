import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './styles/index.css';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

if (!clientId) {
  console.warn(
    'Google OAuth クライアントIDが設定されていません。\nVITE_GOOGLE_CLIENT_ID を .env ファイルに指定してください。'
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId || 'dummy-client-id.apps.googleusercontent.com'}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
