import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { supabase } from './lib/supabase'

// Show a visible error banner instead of a blank screen in Safari
window.onerror = (msg, src, line, col, err) => {
  const root = document.getElementById('root');
  if (root && root.childElementCount === 0) {
    root.innerHTML = `
      <div style="font-family:monospace;padding:40px;color:#ff6b6b;background:#0d0d0d;min-height:100vh">
        <h2 style="color:#ff6b6b">❌ App Crashed</h2>
        <pre style="white-space:pre-wrap;color:#ffd;font-size:13px">${msg}\n\nFile: ${src}\nLine: ${line}:${col}\n\n${err?.stack || ''}</pre>
        <p style="color:#aaa;margin-top:20px">Open Safari → Develop → Show JavaScript Console for full details.</p>
      </div>`;
  }
};

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e.reason);
  window.onerror(String(e.reason), 'Promise', 0, 0, e.reason);
});

// --- PRE-ROUTER AUTH INTERCEPTOR ---
// HashRouter destroys #access_token because it thinks it's a 404 route!
const catchAuthFragment = async () => {
  try {
    const hash = window.location.hash;
    if (hash && (hash.includes('access_token=') || hash.includes('error='))) {
      await supabase.auth.getSession();
      window.history.replaceState(null, '', window.location.pathname + '#/');
    }
  } catch (err) {
    console.error("Session auth fragment interception failure:", err);
  }
};

// Always mount the React app, even if supabase session catch fails
catchAuthFragment().finally(() => {
  try {
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  } catch (err) {
    console.error('React mount failed:', err);
    window.onerror(String(err), 'main.jsx', 0, 0, err);
  }
});
