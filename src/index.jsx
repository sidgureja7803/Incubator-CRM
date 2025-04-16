import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Workbox } from 'workbox-window';

// Register service worker
if ('serviceWorker' in navigator) {
  const wb = new Workbox('/serviceWorker.js');

  wb.addEventListener('installed', (event) => {
    if (event.isUpdate) {
      if (confirm('New app update is available! Click OK to refresh.')) {
        window.location.reload();
      }
    }
  });

  wb.register().catch((err) => {
    console.error('Service worker registration failed:', err);
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
