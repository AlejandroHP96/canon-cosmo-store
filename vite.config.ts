import { defineConfig } from 'vitest/config';
import { loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** Dominio de respaldo cuando no hay VITE_SITE_URL definida. */
const FALLBACK_SITE_URL = 'https://canon-cosmo-store.vercel.app';

/**
 * Sustituye __SITE_URL__ en index.html. Las etiquetas Open Graph de ahí son
 * HTML estático, así que necesitan una URL absoluta ya resuelta en el build:
 * los rastreadores no ejecutan el JS que calcula la de SEO.tsx.
 */
function siteUrl(url: string): Plugin {
    return {
        name: 'site-url',
        transformIndexHtml: {
            order: 'pre',
            handler: (html) => html.replaceAll('__SITE_URL__', url),
        },
    };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const url = (env.VITE_SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, '');

    return {
        plugins: [react(), tailwindcss(), siteUrl(url)],
        server: {
            port: 3000,
        },
        test: {
            // Solo funciones puras por ahora: sin DOM, sin Firebase, sin navegador
            environment: 'node',
            include: ['src/**/*.test.ts'],
        },
    };
});
