import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/dm-sans';
import './index.css';
import { App } from './App';
const rootElement = document.getElementById('root');
if (!rootElement)
    throw new Error('Root element not found');
createRoot(rootElement).render(<StrictMode>
    <App />
  </StrictMode>);
