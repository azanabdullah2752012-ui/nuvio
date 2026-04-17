import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { supabase } from './lib/supabase'

// --- PRE-ROUTER AUTH INTERCEPTOR (Era 10K Fix) ---
// Supabase OAuth uses #access_token, whereas HashRouter uses #/.
// On mobile, this collision can cause session loss. We catch it BEFORE React boots.
const catchAuthFragment = async () => {
  const hash = window.location.hash;
  if (hash && (hash.includes('access_token') || hash.includes('error='))) {
    console.log("NEURAL FRAGMENT DETECTED. CAPTURING SESSION...");
    // Force supabase to process the URL fragment immediately
    await supabase.auth.getSession();
    
    // If the hash is ONLY for auth (not a router path), clean it to prevent Router confusion
    if (!hash.startsWith('#/')) {
       // We'll let the App's AuthOrchestrator handle the final redirect once React is up
    }
  }
};

catchAuthFragment().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
