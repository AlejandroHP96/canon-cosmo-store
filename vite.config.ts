import { defineConfig } from 'vitest/config';
import { loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** Dominio de respaldo cuando no hay VITE_SITE_URL definida. */
const FALLBACK_SITE_URL = 'https://canon-cosmo-store.vercel.app';

/** Rutas fijas de la tienda. Las secciones del catálogo salen de Firestore
 *  en tiempo de ejecución, así que no se pueden listar en el build. */
const STATIC_ROUTES = ['/', '/aboutus', '/torneos', '/reservas'];

/**
 * Sustituye __SITE_URL__ en index.html y genera robots.txt y sitemap.xml.
 *
 * Las etiquetas Open Graph de index.html son HTML estático, así que necesitan
 * una URL absoluta ya resuelta en el build: los rastreadores no ejecutan el JS
 * que calcula la de SEO.tsx. Por lo mismo, robots y sitemap se emiten aquí en
 * vez de vivir en public/, para no repetir el dominio en tres sitios.
 */
function seoAssets(url: string): Plugin {
    return {
        name: 'seo-assets',
        transformIndexHtml: {
            order: 'pre',
            handler: (html) => html.replaceAll('__SITE_URL__', url),
        },
        generateBundle() {
            this.emitFile({
                type: 'asset',
                fileName: 'robots.txt',
                source: [
                    'User-agent: *',
                    'Allow: /',
                    '',
                    '# El panel no debe indexarse',
                    'Disallow: /cosmos-admin',
                    '',
                    `Sitemap: ${url}/sitemap.xml`,
                    '',
                ].join('\n'),
            });

            const urls = STATIC_ROUTES.map(
                (route) =>
                    `    <url>\n        <loc>${url}${route}</loc>\n        <changefreq>weekly</changefreq>\n    </url>`,
            ).join('\n');

            this.emitFile({
                type: 'asset',
                fileName: 'sitemap.xml',
                source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
            });
        },
    };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const url = (env.VITE_SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, '');

    return {
        plugins: [react(), tailwindcss(), seoAssets(url)],
        server: {
            port: 3000,
        },
        optimizeDeps: {
            // firebase/auth solo aparece dentro del chunk diferido del admin, así
            // que Vite no lo descubre al arrancar y lo pre-empaqueta a mitad de
            // sesión. Eso rompía /cosmos-admin en desarrollo con "Component auth
            // has not been registered yet". En el build de producción no pasa.
            include: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
        },
        test: {
            // Solo funciones puras por ahora: sin DOM, sin Firebase, sin navegador
            environment: 'node',
            include: ['src/**/*.test.ts'],
        },
    };
});
