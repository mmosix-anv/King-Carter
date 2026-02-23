import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/mobile-responsive.css'
import App from './App.jsx'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { initGA, initGTM } from './config/analytics'

// Initialize analytics
initGA();
initGTM();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <SpeedInsights />
  </StrictMode>,
)
