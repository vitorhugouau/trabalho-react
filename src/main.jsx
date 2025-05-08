import React from 'react';
import ReactDOM from 'react-dom/client'; 
import { AuthProvider } from './contexts/AuthContext';
import App from './App';

// Use createRoot em vez de render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider> 
    <App />
  </AuthProvider>
);
