import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// ── Synchronously apply saved theme before React renders to prevent flash ──
;(function () {
  try {
    const saved = localStorage.getItem('trustwrite-theme');
    const parsed = saved ? JSON.parse(saved) : null;
    const theme = parsed?.state?.theme ?? 'light';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch {
    // ignore
  }
})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
