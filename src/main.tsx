import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Cloudflare deployment mode:
// By default the app should use the real /api backend shipped with the Worker.
// To intentionally run the local mock/demo mode, set VITE_DEMO_MODE=true before building.
const forceDemoMode = (import.meta as any).env?.VITE_DEMO_MODE === 'true';
if (forceDemoMode) {
  localStorage.removeItem('halal_force_real');
} else {
  localStorage.setItem('halal_force_real', 'true');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
