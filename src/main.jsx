import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Show a visible error banner instead of a blank screen in Safari
window.onerror = (msg, src, line, col, err) => {
  const root = document.getElementById('root');
  if (root && root.childElementCount === 0) {
    root.innerHTML = `
      <div style="font-family:monospace;padding:40px;color:#ff6b6b;background:#0d0d0d;min-height:100vh">
        <h2 style="color:#ff6b6b">❌ App Crashed</h2>
        <pre style="white-space:pre-wrap;color:#ffd;font-size:13px">${msg}\n\nFile: ${src}\nLine: ${line}:${col}\n\n${err?.stack || ''}</pre>
        <p style="color:#aaa;margin-top:20px">Check console for details.</p>
      </div>`;
  }
};

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e.reason);
});

// Always mount the React app directly (100% offline, zero remote auth lag)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
