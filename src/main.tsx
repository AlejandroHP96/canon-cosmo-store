import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
    <HelmetProvider>
        <BrowserRouter>
            <StrictMode>
                {/* Red de seguridad final: si falla algo fuera del Layout
                    (rutas, providers), al menos no queda la página en blanco */}
                <ErrorBoundary showHomeLink={false}>
                    <App />
                </ErrorBoundary>
            </StrictMode>
        </BrowserRouter>
    </HelmetProvider>,
);
