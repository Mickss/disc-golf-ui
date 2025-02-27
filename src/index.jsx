import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from "./auth/AuthContext";
import {LoadingProvider} from "./spinner/LoadingProvider";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <LoadingProvider>
        <App />
      </LoadingProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
