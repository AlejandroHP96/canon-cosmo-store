import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 3000,
    },
    test: {
        // Solo funciones puras por ahora: sin DOM, sin Firebase, sin navegador
        environment: 'node',
        include: ['src/**/*.test.ts'],
    },
});
