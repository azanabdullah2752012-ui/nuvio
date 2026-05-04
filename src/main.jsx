import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { supabase } from './lib/supabase'

// --- PRE-ROUTER AUTH INTERCEPTOR (Era 10K Fix) ---
// CRITICAL FIX: HashRouter destroys #access_token because it thinks it's a 404 route!
const catchAuthFragment = async () => {
  const hash = window.location.hash;
  if (hash && (hash.includes('access_token=') || hash.includes('error='))) {
    console.log("NEURAL FRAGMENT DETECTED. CAPTURING SESSION...");
    
    // 1. Force Supabase to parse the token into localStorage immediately
    await supabase.auth.getSession();
    
    // 2. Erase the auth fragment so HashRouter boots into the standard root '/'
    // instead of hitting the 404 fallback and wiping the session out.
    window.history.replaceState(null, '', window.location.pathname + '#/');
  }
};

catchAuthFragment().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
