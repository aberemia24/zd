// Entry point pentru aplicația React
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <BrowserRouter> 
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter> 
  </React.StrictMode>
);
